import type { LoggerService } from "@backstage/backend-plugin-api";
import type { Entity } from "@backstage/catalog-model";
import type { LocationSpec } from "@backstage/plugin-catalog-common";
import {
	type CatalogProcessor,
	type CatalogProcessorCache,
	type CatalogProcessorEmit,
	processingResult,
} from "@backstage/plugin-catalog-node";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import yaml from "js-yaml";
import dcSchema from "../schemas/datacontract.schema.json";

const ajv = new Ajv({
	allErrors: true,
	strict: "log",
	allowUnionTypes: true,
	validateFormats: true,
	strictSchema: false,
	strictTypes: false,
});
addFormats(ajv);

// Add custom URI format that allows URIs with wildcards and template variables
ajv.addFormat("uri", {
	type: "string",
	validate: (uri: string) => {
		// Allow standard URIs
		try {
			new URL(uri);
			return true;
		} catch {
			// If standard URL parsing fails, check for URIs with patterns
			// Support various schemes like s3://, gs://, abfss://, hdfs://, etc.
			const uriPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[a-zA-Z0-9\-._@]+\/.*$/;
			const hasTemplateVariables = /\{[^}]+\}/.test(uri);
			const hasWildcards = /\*/.test(uri);

			// Allow URIs with template variables and wildcards
			if (uriPattern.test(uri) && (hasTemplateVariables || hasWildcards)) {
				return true;
			}

			// Try to validate by replacing template variables and wildcards with valid characters
			const normalizedUri = uri
				.replace(/\{[^}]+\}/g, "placeholder") // Replace {model} with placeholder
				.replace(/\*/g, "wildcard"); // Replace * with wildcard

			try {
				new URL(normalizedUri);
				return true;
			} catch {
				return false;
			}
		}
	},
});

const validate = ajv.compile(dcSchema);

enum ValidationErrorType {
	INVALID_YAML = 'INVALID_YAML',
	MISSING_DATA_CONTRACT_SPEC = 'MISSING_DATA_CONTRACT_SPEC',
	INVALID_DATA_CONTRACT_FIELDS = 'INVALID_DATA_CONTRACT_FIELDS'
}

interface ValidationResult {
	isValid: boolean;
	errorType?: ValidationErrorType;
	errorMessage?: string;
	shouldFailIngestion: boolean;
}

/**
 * Catalog processor that loads datacontract definitions from $file references
 * in API entities with type `datacontract`.
 */
export class DataContractProcessor implements CatalogProcessor {
	logger: LoggerService;

	constructor(logger: LoggerService) {
		this.logger = logger;
		this.logger.info("DataContractProcessor initialized");
	}

	getProcessorName(): string {
		return "DataContractProcessor";
	}

	async validateEntityKind?(entity: Entity): Promise<boolean> {
		if (entity.kind !== "API" || entity.spec?.type !== "datacontract") {
			this.logger.info(
				`Validating DataContract for entity ${entity.metadata.name}: skipped`,
			);
			return false;
		}

		this.logger.info(
			`Validating DataContract for entity ${entity.metadata.name}`,
		);

		const validationResult = this.validateDataContract(entity);
		
		if (!validationResult.isValid && validationResult.shouldFailIngestion) {
			this.logger.error(
				`DataContract validation failed for entity ${entity.metadata.name}: ${validationResult.errorMessage}`,
			);
			throw new Error(validationResult.errorMessage);
		}

		if (!validationResult.isValid) {
			this.logger.warn(
				`DataContract validation warnings for entity ${entity.metadata.name}: ${validationResult.errorMessage}`,
			);
		}

		return true;
	}

	private getDefinitionYaml(entity: Entity): unknown {
		const definition = entity.spec?.definition;
		if (definition && typeof definition === "string") {
			try {
				const parsed = yaml.load(definition);
				if (typeof parsed !== "object" || parsed === null) {
					throw new Error(
						`Invalid DataContract definition for entity ${entity.metadata.name}: not a valid YAML object`,
					);
				}
				return parsed;
			} catch (error) {
				throw new Error(
					`Invalid DataContract definition for entity ${entity.metadata.name}: not a valid YAML object`,
				);
			}
		}
		return undefined;
	}

	private validateDataContract(entity: Entity): ValidationResult {
		try {
			const definition = this.getDefinitionYaml(entity);
			if (!definition) {
				return { isValid: true, shouldFailIngestion: false };
			}

			// Check if it's missing the dataContractSpecification field (case 2)
			if (typeof definition === 'object' && definition !== null) {
				const defObj = definition as Record<string, unknown>;
				if (!('dataContractSpecification' in defObj)) {
					return {
						isValid: false,
						errorType: ValidationErrorType.MISSING_DATA_CONTRACT_SPEC,
						errorMessage: `Entity ${entity.metadata.name} is missing required 'dataContractSpecification' field`,
						shouldFailIngestion: true
					};
				}
			}

			// Run full schema validation
			const valid = validate(definition);
			if (!valid) {
				const errors = validate.errors || [];
				const validationMessages = errors
					.map((error) => `${error.instancePath || "root"}: ${error.message}`)
					.join("; ");

				return {
					isValid: false,
					errorType: ValidationErrorType.INVALID_DATA_CONTRACT_FIELDS,
					errorMessage: `DataContract validation failed: ${validationMessages}`,
					shouldFailIngestion: false // Don't fail ingestion for field validation errors
				};
			}

			return { isValid: true, shouldFailIngestion: false };
		} catch (error) {
			// Case 1: Invalid YAML
			return {
				isValid: false,
				errorType: ValidationErrorType.INVALID_YAML,
				errorMessage: error instanceof Error ? error.message : String(error),
				shouldFailIngestion: true
			};
		}
	}

	postProcessEntity?(
		entity: Entity,
		location: LocationSpec,
		emit: CatalogProcessorEmit,
		_cache: CatalogProcessorCache,
	): Promise<Entity> {
		// Only process datacontract API entities
		if (entity.kind !== "API" || entity.spec?.type !== "datacontract") {
			return Promise.resolve(entity);
		}

		const validationResult = this.validateDataContract(entity);

		if (!validationResult.isValid) {
			if (validationResult.shouldFailIngestion) {
				// Cases 1 & 2: Emit processing error for invalid YAML or missing dataContractSpecification
				this.logger.error(
					`Error processing DataContract for entity ${entity.metadata.name}: ${validationResult.errorMessage}`,
				);
				
				emit(
					processingResult.generalError(
						location,
						validationResult.errorMessage!,
					),
				);
			} else {
				// Case 3: For invalid fields, log warning but don't emit error (will be shown in frontend)
				this.logger.warn(
					`DataContract validation warnings for entity ${entity.metadata.name}: ${validationResult.errorMessage}`,
				);
				
				// Store validation errors in entity annotations for frontend access
				if (!entity.metadata.annotations) {
					entity.metadata.annotations = {};
				}
				entity.metadata.annotations['datacontract.io/validation-errors'] = validationResult.errorMessage!;
			}
		} else {
			this.logger.info(
				`DataContract validation successful for entity ${entity.metadata.name}`,
			);
			
			// Clear any existing validation errors if validation passes
			if (entity.metadata.annotations && entity.metadata.annotations['datacontract.io/validation-errors']) {
				delete entity.metadata.annotations['datacontract.io/validation-errors'];
			}
		}

		return Promise.resolve(entity);
	}
}

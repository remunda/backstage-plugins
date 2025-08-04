import type { LoggerService } from "@backstage/backend-plugin-api";
import type { Entity } from "@backstage/catalog-model";
import type { CatalogProcessor } from "@backstage/plugin-catalog-node";
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
const validate = ajv.compile(dcSchema);

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

		const definition = entity.spec.definition;
		if (definition && typeof definition === "string") {
			const parsed = yaml.load(definition);
			const valid = validate(parsed);
			this.logger.info(
				`Validating DataContract for entity ${entity.metadata.name}: ${valid}`,
			);

			if (!valid) {
				throw new Error(
					`DataContract validation failed: ${JSON.stringify(validate.errors)}`,
				);
			}
		}

		return true;
	}
}

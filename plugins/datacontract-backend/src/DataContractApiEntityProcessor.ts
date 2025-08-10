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
        `Validating DataContract for entity ${entity.metadata.name}: skipped`
      );
      return false;
    }

    this.logger.info(
      `Validating DataContract for entity ${entity.metadata.name}`
    );

    try {
      const definition = this.getDefinitionYaml(entity);
      if (definition) {
        const valid = validate(definition);
        if (!valid) {
          const errors = validate.errors || [];
          const validationMessages = errors
            .map((error) => `${error.instancePath || "root"}: ${error.message}`)
            .join("; ");
          throw new Error(
            `DataContract validation failed: ${validationMessages}`
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`DataContract validation failed: ${String(error)}`);
    }

    return true;
  }

  private getDefinitionYaml(entity: Entity): unknown {
    const definition = entity.spec?.definition;
    if (definition && typeof definition === "string") {
      const parsed = yaml.load(definition);
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error(
          `Invalid DataContract definition for entity ${entity.metadata.name}: not a valid YAML object`
        );
      }
      return parsed;
    }
    return undefined;
  }

  postProcessEntity?(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
    _cache: CatalogProcessorCache
  ): Promise<Entity> {
    // Only process datacontract API entities
    if (entity.kind !== "API" || entity.spec?.type !== "datacontract") {
      return Promise.resolve(entity);
    }

    try {
      const definition = this.getDefinitionYaml(entity);
      if (definition) {
        const valid = validate(definition);
        this.logger.info(
          `Validating DataContract for entity ${entity.metadata.name}: ${valid}`
        );

        if (!valid) {
          const errors = validate.errors || [];
          const validationMessages = errors
            .map((error) => `${error.instancePath || "root"}: ${error.message}`)
            .join("; ");

          this.logger.warn(
            `DataContract validation failed for entity ${entity.metadata.name}: ${validationMessages}`
          );

          // Emit validation errors so they appear in the Backstage UI
          emit(
            processingResult.generalError(
              location,
              `DataContract validation failed: ${validationMessages}`
            )
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error processing DataContract for entity ${entity.metadata.name}: ${error}`
      );

      // Emit processing error
      emit(
        processingResult.generalError(
          location,
          `DataContract processing error: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    }

    return Promise.resolve(entity);
  }
}

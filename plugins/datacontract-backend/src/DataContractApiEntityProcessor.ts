import type { Entity } from "@backstage/catalog-model";
import type { CatalogProcessor } from "@backstage/plugin-catalog-node";
import Ajv from "ajv";
import yaml from "js-yaml";
import dcSchema from "../schemas/datacontract.schema.json";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(dcSchema);

/**
 * Catalog processor that loads datacontract definitions from $file references
 * in API entities with type `datacontract`.
 */
export class DataContractProcessor implements CatalogProcessor {
	getProcessorName(): string {
		return "DataContractProcessor";
	}

	async validateKind?(entity: Entity): Promise<boolean> {
		if (entity.kind !== "API" || entity.spec?.type !== "datacontract") {
			return false;
		}

		const definition = entity.spec.definition;
		if (definition && typeof definition === "string") {
			const parsed = yaml.load(definition);
			const valid = validate(parsed);
			if (!valid) {
				throw new Error(
					`DataContract validation failed: ${JSON.stringify(validate.errors)}`,
				);
			}
		}

		return true;
	}
}

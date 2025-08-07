import type { LoggerService } from "@backstage/backend-plugin-api";
import type { Entity } from "@backstage/catalog-model";
import type { CatalogProcessor } from "@backstage/plugin-catalog-node";
/**
 * Catalog processor that loads datacontract definitions from $file references
 * in API entities with type `datacontract`.
 */
export declare class DataContractProcessor implements CatalogProcessor {
    logger: LoggerService;
    constructor(logger: LoggerService);
    getProcessorName(): string;
    validateEntityKind?(entity: Entity): Promise<boolean>;
}

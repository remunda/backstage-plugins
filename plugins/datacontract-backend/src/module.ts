import {
	coreServices,
	createBackendModule,
} from "@backstage/backend-plugin-api";

import { catalogProcessingExtensionPoint } from "@backstage/plugin-catalog-node/alpha";
import { DataContractProcessor } from "./DataContractApiEntityProcessor";

/**
 * datacontract backend plugin
 *
 * @public
 */
export const dataContractCatalogModule = createBackendModule({
	pluginId: "catalog",
	moduleId: "backstage-plugin-datacontract-backend",
	register(env) {
		env.registerInit({
			deps: {
				catalog: catalogProcessingExtensionPoint,
				logger: coreServices.logger,
			},
			async init({ catalog, logger }) {
				logger.info(
					"Initializing backstage-plugin-datacontract-backend plugin",
				);
				console.log(
					"Initializing backstage-plugin-datacontract-backend plugin",
				);
				catalog.addProcessor(
					new DataContractProcessor(
						logger.child({ pluginId: "backstage-plugin-datacontract-backend" }),
					),
				);
			},
		});
	},
});

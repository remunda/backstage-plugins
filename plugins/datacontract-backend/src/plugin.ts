import {
	coreServices,
	createBackendPlugin,
} from "@backstage/backend-plugin-api";
import { catalogServiceRef } from "@backstage/plugin-catalog-node";

/**
 * datacontract backend plugin
 *
 * @public
 */
export const datacontractBackendPlugin = createBackendPlugin({
	pluginId: "backstage-plugin-datacontract-backend",
	register(env) {
		env.registerInit({
			deps: {
				logger: coreServices.logger,
				httpAuth: coreServices.httpAuth,
				httpRouter: coreServices.httpRouter,
				catalog: catalogServiceRef,
			},
			async init({ logger }) {
				logger.info(
					"Initializing backstage-plugin-datacontract-backend plugin",
				);
			},
		});
	},
});

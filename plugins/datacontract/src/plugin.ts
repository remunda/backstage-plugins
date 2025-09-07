//import type { ApiEntity } from "@backstage/catalog-model";

import type { ApiEntity } from "@backstage/catalog-model";
import {
	createApiFactory,
	createPlugin,
	createRoutableExtension,
} from "@backstage/core-plugin-api";
import {
	type ApiDefinitionWidget,
	apiDocsConfigRef,
} from "@backstage/plugin-api-docs";
import React, { type JSXElementConstructor } from "react";
import type { DataContractDefinitionWidgetProps } from "./components/DataContractDefinitionWidget";
import { rootRouteRef } from "./routes";

export const withDatacontractApiDocsConfigFactory = (
	definitionWidgets: ApiDefinitionWidget[],
) => {
	return createApiFactory({
		api: apiDocsConfigRef,
		deps: {},
		factory: () => ({
			getApiDefinitionWidget: (apiEntity: ApiEntity) => {
				if (apiEntity.spec.type === "datacontract") {
					return {
						type: "datacontract",
						title: "DataContract",
						rawLanguage: "yaml",
						component: (definition: string): JSX.Element =>
							React.createElement(
								DataContractDefinitionWidget as JSXElementConstructor<DataContractDefinitionWidgetProps>,
								{ definition },
							),
					};
				}
				// fallback to the defaults
				return definitionWidgets.find((d) => d.type === apiEntity.spec.type);
			},
		}),
	});
};

export const datacontractPlugin = createPlugin({
	id: "backstage-plugin-datacontract",
	routes: {
		root: rootRouteRef,
	},
});

export const DataContractDefinitionWidget = datacontractPlugin.provide(
	createRoutableExtension({
		name: "DataContractDefinitionWidget",
		component: () =>
			import("./components/DataContractDefinitionWidget").then(
				(m) => m.DataContractDefinitionWidget,
			),
		mountPoint: rootRouteRef,
	}),
);

import type { ApiEntity } from "@backstage/catalog-model";
import {
	createApiFactory,
	createComponentExtension,
	createPlugin,
} from "@backstage/core-plugin-api";
import {
	apiDocsConfigRef,
	defaultDefinitionWidgets,
	plugin,
} from "@backstage/plugin-api-docs";
import React from "react";
import { rootRouteRef } from "./routes";

export const getApiDocsConfigFactory = () =>
	createApiFactory({
		api: apiDocsConfigRef,
		deps: {},
		factory: () => {
			const definitionWidgets = defaultDefinitionWidgets();
			return {
				getApiDefinitionWidget: (apiEntity: ApiEntity) => {
					if (apiEntity.spec.type === "datacontract") {
						return {
							type: "datacontract",
							title: "DataContract",
							rawLanguage: "yaml",
							component: (definition) =>
								React.createElement(DataContractDefinitionWidget, {
									definition,
								}),
						};
					}
					// fallback to the defaults
					return definitionWidgets.find((d) => d.type === apiEntity.spec.type);
				},
			};
		},
	});

export const datacontractPlugin = createPlugin({
	id: "backstage-plugin-datacontract",
	routes: {
		root: rootRouteRef,
	},
});

export const DataContractDefinitionWidget = plugin.provide(
	createComponentExtension({
		component: {
			lazy: () =>
				import("./components/DataContractDefinitionWidget").then(
					(m) => m.DataContractDefinitionWidget,
				),
		},
	}),
);

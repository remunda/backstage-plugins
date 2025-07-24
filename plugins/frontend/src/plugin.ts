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
import React from "react";
import { DataContractDefinitionWidget } from "./components/DataContractDefinitionWidget";
import { rootRouteRef } from "./routes";

const dataContractWidget: ApiDefinitionWidget = {
	type: "datacontract",
	title: "DataContract",
	rawLanguage: "yaml",
	component: (definition) =>
		React.createElement(DataContractDefinitionWidget, { definition }),
};

export const datacontractPlugin = createPlugin({
	id: "backstage-plugin-datacontract",
	routes: {
		root: rootRouteRef,
	},
	apis: [
		createApiFactory({
			api: apiDocsConfigRef,
			deps: {},
			factory: () => ({
				getApiDefinitionWidget: (apiEntity: ApiEntity) => {
					if (apiEntity.spec.type === "datacontract") {
						return dataContractWidget;
					}
					return undefined;
				},
			}),
		}),
	],
});

export const DatacontractPage = datacontractPlugin.provide(
	createRoutableExtension({
		name: "{{ extensionName }}",
		component: () =>
			import("./components/ExampleComponent").then((m) => m.ExampleComponent),
		mountPoint: rootRouteRef,
	}),
);

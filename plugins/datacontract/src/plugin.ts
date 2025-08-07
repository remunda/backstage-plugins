//import type { ApiEntity } from "@backstage/catalog-model";
import {
	createPlugin,
	createRoutableExtension,
} from "@backstage/core-plugin-api";
// import type { ApiDefinitionWidget } from "@backstage/plugin-api-docs";
// import React from "react";
// import { DataContractDefinitionWidget } from "./components/DataContractDefinitionWidget";
import { rootRouteRef } from "./routes";

// export const getApiDocsConfigFactory = (
//   definitionWidgets: ApiDefinitionWidget[]
// ) => {
//   const factory = {
//     getApiDefinitionWidget: (apiEntity: ApiEntity) => {
//       if (apiEntity.spec.type === "datacontract") {
//         return {
//           type: "datacontract",
//           title: "DataContract",
//           rawLanguage: "yaml",
//           component: (definition: string) =>
//             React.createElement(DataContractDefinitionWidget, {
//               definition,
//             }),
//         };
//       }
//       // fallback to the defaults
//       return definitionWidgets.find((d) => d.type === apiEntity.spec.type);
//     },
//   };
//   return factory;
// };

export const datacontractPlugin = createPlugin({
	id: "backstage-plugin-datacontract",
	routes: {
		root: rootRouteRef,
	},
});

export const DataContractPage = datacontractPlugin.provide(
	createRoutableExtension({
		name: "DataContractPage",
		component: () =>
			import("./components/DataContractDefinitionWidget").then(
				(m) => m.DataContractDefinitionWidget,
			),
		mountPoint: rootRouteRef,
	}),

	
);

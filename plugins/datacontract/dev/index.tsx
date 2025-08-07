import type { ApiEntity } from "@backstage/catalog-model";
import { createApiFactory } from "@backstage/core-plugin-api";
import { createDevApp } from "@backstage/dev-utils";
import {
	type ApiDefinitionWidget,
	apiDocsConfigRef,
	defaultDefinitionWidgets,
} from "@backstage/plugin-api-docs";
import { DataContractPage, datacontractPlugin } from "../src/plugin";

createDevApp()
	.registerPlugin(datacontractPlugin)
	.addPage({
		element: <DataContractPage definition="xxx" />,
		title: "Root Page",
		path: "/backstage-plugin-datacontract",
	})
	.registerApi(
		createApiFactory({
			api: apiDocsConfigRef,
			deps: {},
			factory: () => {
				const definitionWidgets = defaultDefinitionWidgets();

				const factory = {
					getApiDefinitionWidget: (apiEntity: ApiEntity) => {
						if (apiEntity.spec.type === "datacontract") {
							return {
								type: "datacontract",
								title: "DataContract",
								rawLanguage: "yaml",
								component: (definition: string) => (
									<div>
										<DataContractPage definition={definition} />
									</div>
								),
							} as ApiDefinitionWidget;
						}
						// fallback to the defaults
						return definitionWidgets.find(
							(d) => d.type === apiEntity.spec.type,
						);
					},
				};
				return factory;
			},
		}),
	)
	.render();

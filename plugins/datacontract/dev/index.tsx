import { createDevApp } from "@backstage/dev-utils";
import { DatacontractPage, datacontractPlugin } from "../src/plugin";

createDevApp()
	.registerPlugin(datacontractPlugin)
	.addPage({
		element: <DatacontractPage />,
		title: "Root Page",
		path: "/backstage-plugin-datacontract",
	})
	.render();

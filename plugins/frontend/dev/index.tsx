import { createDevApp } from "@backstage/dev-utils";
import { datacontractPlugin, DatacontractPage } from "../src/plugin";

createDevApp()
  .registerPlugin(datacontractPlugin)
  .addPage({
    element: <DatacontractPage />,
    title: "Root Page",
    path: "/backstage-plugin-datacontract",
  })
  .render();

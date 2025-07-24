import {
  createPlugin,
  createRoutableExtension,
} from "@backstage/core-plugin-api";

import { rootRouteRef } from "./routes";

export const datacontractPlugin = createPlugin({
  id: "backstage-plugin-datacontract",
  routes: {
    root: rootRouteRef,
  },
});

export const datacontractPage = datacontractPlugin.provide(
  createRoutableExtension({
    name: "{{ extensionName }}",
    component: () =>
      import("./components/ExampleComponent").then((m) => m.ExampleComponent),
    mountPoint: rootRouteRef,
  })
);

import { jsx as _jsx } from "react/jsx-runtime";
import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';
export const datacontractRouteRef = createRouteRef({
    id: 'datacontract',
});
export const datacontractPlugin = createPlugin({
    id: 'datacontract',
    routes: {
        root: datacontractRouteRef,
    },
});
export const DatacontractPage = () => {
    return (_jsx("div", { style: { padding: 20 }, children: _jsx("h1", { children: "DataContract Ingest" }) }));
};

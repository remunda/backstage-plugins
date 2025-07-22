import React from 'react';
import { createPlugin, createRouteRef, RouteRef } from '@backstage/core-plugin-api';

export const datacontractRouteRef: RouteRef<undefined> = createRouteRef({
  id: 'datacontract',
});

export const datacontractPlugin = createPlugin({
  id: 'datacontract',
  routes: {
    root: datacontractRouteRef,
  },
});

export const DatacontractPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>DataContract Ingest</h1>
      {/* TODO: implement UI similar to datacontract editor */}
    </div>
  );
};

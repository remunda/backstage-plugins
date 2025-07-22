import React from 'react';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  RouteRef,
} from '@backstage/core-plugin-api';
import { apiDocsConfigRef } from '@backstage/plugin-api-docs';
import { DatacontractDefinitionWidget } from './widgets/DatacontractDefinitionWidget';

export const datacontractRouteRef: RouteRef<undefined> = createRouteRef({
  id: 'datacontract',
});

export const datacontractPlugin = createPlugin({
  id: 'datacontract',
  routes: {
    root: datacontractRouteRef,
  },
  apis: [
    createApiFactory({
      api: apiDocsConfigRef,
      deps: {},
      factory: () => ({
        getApiDefinitionWidget: apiEntity => {
          if (apiEntity.spec.type === 'datacontract') {
            return {
              type: 'datacontract',
              title: 'DataContract',
              rawLanguage: 'yaml',
              component: definition => (
                <DatacontractDefinitionWidget definition={definition} />
              ),
            };
          }
          return undefined;
        },
      }),
    }),
  ],
});

export const DatacontractPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>DataContract Ingest</h1>
    </div>
  );
};

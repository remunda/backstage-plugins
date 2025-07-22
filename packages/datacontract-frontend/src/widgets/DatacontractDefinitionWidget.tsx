import React from 'react';
import { CodeSnippet } from '@backstage/core-components';

export const DatacontractDefinitionWidget = ({ definition }: { definition: string }) => (
  <CodeSnippet text={definition} language="yaml" showLineNumbers />
);

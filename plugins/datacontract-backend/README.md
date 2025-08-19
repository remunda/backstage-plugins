# Data Contract API Plugin (backend)

Backend module for validating and processing Data Contract API entities in Backstage.

This module adds a catalog processor that:

- Detects API entities with `spec.type: datacontract`
- Validates the YAML definition against the official Data Contract JSON schema
- Surfaces validation errors in the Catalog processing output

Works together with the frontend plugin `@remunda/backstage-plugin-datacontract` which renders the Data Contract definition in the API Docs view.

## Installation

1) Install the package in your Backstage backend workspace:

```bash
yarn workspace backend add @remunda/backstage-plugin-datacontract-backend
```

2) Register the catalog module in your backend. If you use the modern backend system:

```ts
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// Add the DataContract catalog module
backend.add(import('@remunda/backstage-plugin-datacontract-backend'));

backend.start();
```

This registers a catalog processor that validates Data Contract API entities during ingestion.

## Usage

Create API entities with `spec.type: datacontract` and either inline YAML or a `$file:` reference in `spec.definition`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
	name: orders-data-contract
spec:
	type: datacontract
	definition: $file:./orders-datacontract.yaml
```

Validation results are emitted into the catalog processing logs and UI errors when the schema is not satisfied.

## Configuration

No special configuration is required. The plugin ships with the Data Contract schema and custom URI format support to allow templated/wildcard URIs (for example `s3://.../{model}/*.json`).

## Development

```bash
# Run tests
yarn workspace @remunda/backstage-plugin-datacontract-backend test

# Build
yarn workspace @remunda/backstage-plugin-datacontract-backend build
```

See the repository root README for monorepo development instructions.

## License

Apache-2.0, see the repository root `LICENSE`.


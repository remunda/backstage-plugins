# ADR-001: Plugin Architecture and Entity Integration

## Status
Accepted

## Context
We needed to create a Backstage plugin for managing and visualizing DataContract YAML files. The challenge was to integrate DataContract specifications into the existing Backstage ecosystem in a way that feels native and provides value to teams managing data contracts.

## Decision
We decided to implement a dual-plugin architecture:

1. **Backend Plugin** (`@remunda/backstage-plugin-datacontract-backend`)
   - Custom catalog processor for resolving `$file:` references in API entities
   - Validation against the official DataContract specification
   - Injection of raw YAML into entity metadata
   - REST endpoints for DataContract validation

2. **Frontend Plugin** (`@remunda/backstage-plugin-datacontract`)
   - Extension of the API Docs definition widget
   - Rich visualization of DataContract content
   - Integration with Backstage's entity system

## Architecture

### Entity Integration
- API entities reference DataContract files using `$file:` in `spec.definition`
- Plugin recognizes entities where `spec.type` is set to `datacontract`
- Backend processor resolves file references and validates content
- Frontend renders DataContract content when appropriate entity type is detected

### Plugin Structure
```
plugins/
├── datacontract/              # Frontend plugin
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── plugin.ts         # Plugin definition
│   │   └── routes.ts         # Route definitions
│   └── package.json
└── datacontract-backend/      # Backend plugin
    ├── src/
    │   ├── processors/       # Catalog processors
    │   ├── module.ts         # Backend module
    │   └── plugin.ts         # Plugin definition
    └── package.json
```

## Consequences

### Positive
- **Native Integration**: DataContracts appear as first-class entities in Backstage
- **Validation**: Automatic validation against official specification
- **Traceability**: Direct linking between services and their data contracts
- **Extensibility**: Architecture supports future enhancements and integrations
- **Separation of Concerns**: Clear separation between backend processing and frontend presentation

### Negative
- **Complexity**: Dual-plugin architecture requires coordination between frontend and backend
- **Dependency**: Requires both plugins to be installed for full functionality
- **Learning Curve**: Developers need to understand Backstage entity system and DataContract specification

## Alternatives Considered

1. **Single Plugin Approach**: Considered combining frontend and backend into one plugin, but rejected due to Backstage's architectural patterns
2. **External Service**: Considered implementing as separate microservice, but rejected to maintain tight Backstage integration
3. **Custom Entity Kind**: Considered creating new entity kind instead of extending API entities, but rejected to leverage existing Backstage patterns

## Implementation Details

### Catalog Processor
```typescript
export class DataContractApiEntityProcessor implements CatalogProcessor {
  // Processes API entities with spec.type === 'datacontract'
  // Resolves $file: references and validates YAML
  // Injects processed content into entity metadata
}
```

### Widget Registration
```typescript
export const dataContractPlugin = createPlugin({
  id: 'datacontract',
  apis: [],
  routes: {
    root: rootRouteRef,
  },
});

export const EntityDataContractDefinitionCard = dataContractPlugin.provide(
  createRoutableExtension({
    // Extends API documentation with DataContract rendering
  })
);
```

## Related
- [ADR-002: Iframe-Based Template Rendering](./002-iframe-template-rendering.md)
- [DataContract Specification](https://github.com/datacontract/datacontract-specification)

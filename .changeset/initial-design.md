---
"@remunda/backstage-plugin-datacontract": minor
"@remunda/backstage-plugin-datacontract-backend": minor
---

Initial design and implementation of DataContract Backstage Plugin

This introduces the foundational design and implementation for the backstage-plugin-datacontract. The plugin provides tools and UI components for managing, validating, and visualizing data contracts within Backstage.

Key features:
- Recognition of Backstage entities of kind `API` where `spec.type` is set to `datacontract`
- UI for viewing details and metadata of DataContract API entities
- Linking data contract definitions to corresponding API entities for traceability
- Validation and visualization features for data contracts
- Core components for listing, viewing, and validating data contracts
- Integration with Backstage catalog and entity system

---
"@remunda/backstage-plugin-datacontract": minor
---

Iframe-based data contract template rendering with CSS isolation

Implemented a secure iframe-based rendering system for data contract templates that provides complete CSS isolation and prevents styling conflicts with the parent Backstage application.

Key features:
- Complete CSS isolation through iframe sandboxing
- TailwindCSS integration for consistent styling
- Secure data URL rendering without CORS issues
- Editor-style template system for professional presentation
- Responsive design within Backstage layout
- Content Security Policy compliant implementation

Components added:
- DataContractDefinitionWidget for iframe management
- iframe-template.ts for HTML document generation
- iframe-styles.ts for CSS styling
- Enhanced htmlRenderer.ts template engine

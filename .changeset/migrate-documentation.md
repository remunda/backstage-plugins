---
"@remunda/backstage-plugin-datacontract": patch
"@remunda/backstage-plugin-datacontract-backend": patch
---

Migrate documentation from .changes to changesets and docs

Converted historical documentation from `.changes/` directory into proper changesets for better release management and moved architectural documentation to `docs/` directory.

Changes:
- Converted `initial-design.md` and `iframe-template-implementation.md` to changesets
- Moved detailed documentation to `docs/` directory for better organization
- Updated all references from `.changes/` to proper changeset workflow
- Removed unused `version:sync` script from package.json
- Updated AGENTS.md, README.md to reference new documentation structure

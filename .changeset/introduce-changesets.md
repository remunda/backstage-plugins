---
"@remunda/backstage-plugin-datacontract": patch
"@remunda/backstage-plugin-datacontract-backend": patch
---

Introduce changesets for release management and improve documentation structure

This introduces changesets as the new release management system for this repository, replacing the previous manual workflow. Along with this change, we've restructured and improved the project's documentation organization.

## Release Management Changes

**Migration from Manual to Changesets:**
- Implemented changesets workflow for automated release management
- GitHub Actions now automatically creates release PRs when changesets are present
- Enables independent versioning of packages based on actual changes
- Provides explicit change documentation and better changelog generation

**Workflow:**
1. Developers create changesets with `yarn changeset` to document changes
2. GitHub Actions automatically creates release PRs with version bumps and changelogs
3. Maintainers review and merge release PRs to publish packages

## Documentation Improvements

**Architecture Decision Records (ADRs):**
- Converted existing documentation to standardized ADR format in `adr/` directory
- Created ADR-001: Plugin Architecture and Entity Integration
- Created ADR-002: Iframe-Based Template Rendering  
- Created ADR-003: Migration from Semantic Release to Changesets
- Added comprehensive ADR index and format documentation

**Historical Changes Migration:**
- Converted historical documentation from custom `.changes/` directory to proper changesets
- Migrated `initial-design.md` and `iframe-template-implementation.md` to changesets for proper versioning
- Updated all references throughout the codebase to use new changeset workflow

# Instructions for Contributors

This repository contains a Backstage plugin for ingesting and validating
DataContract YAML files. Any significant architectural decision or change
should be captured in the documentation. If you add new components or modify
the ingest flow, update the relevant README or create additional docs as
needed.

AI assistants (OpenAI Codex, GitHub Copilot, Claude) should follow these
instructions and keep this file up to date when making large changes.

## Change Set Documentation

All significant changes, features, and bug fixes should be documented using **Changesets**. When making changes:

1. **Create a changeset** using `yarn changeset`
2. **Select affected packages** and specify the type of change (patch/minor/major)
3. **Write a clear description** of what was implemented or fixed

This practice ensures:
- Proper semantic versioning of packages
- Automatic changelog generation
- Clear release management
- Transparency in development decisions
- Historical context for future changes
- Clear communication of what was accomplished

Additional documentation for significant architectural changes should still be captured in the `docs/` directory or as separate documentation files. For example, see the files in `docs/` that document major design decisions and implementation details:

- **Feature/Bug Description**: Clear title and description of what was implemented or fixed
- **Acceptance Criteria**: Specific, testable requirements that define completion
- **Validation**: Evidence that the change works as intended
- **Traceability**: Clear documentation for future contributors and maintainers

Example changeset creation:
```bash
yarn changeset
# Follow prompts to select packages and change type
# Write summary: "Add data visualization component to improve UX"
```

## Recent Updates

- Added `DataContractProcessor` which validates `$file` references in API entities and inserts the YAML during catalog ingestion.
- Frontend plugin now registers a definition widget for APIs of type `datacontract`.

## Important

Use yarn for managing dependencies. Repository is monorepo, so also use related workspace command.
Before each commit run `yarn precommit` to lint, fix and format all files with BiomeJS.

For commits use conventional commits format

Use playwright MCP for validation frontend implementation, start FE with `yarn start:fe`
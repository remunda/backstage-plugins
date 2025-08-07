# Instructions for Contributors

This repository contains a Backstage plugin for ingesting and validating
DataContract YAML files. Any significant architectural decision or change
should be captured in the documentation. If you add new components or modify
the ingest flow, update the relevant README or create additional docs as
needed.

AI assistants (OpenAI Codex, GitHub Copilot, Claude) should follow these
instructions and keep this file up to date when making large changes.

## Change Set Documentation

All significant changes, features, and bug fixes should be documented as change sets in the `.changes/` directory. Each change set should follow the format demonstrated in `initial-design.md`:

- **Feature/Bug Description**: Clear title and description of what was implemented or fixed
- **Acceptance Criteria**: Specific, testable requirements that define completion
- **Validation**: Evidence that the change works as intended
- **Traceability**: Clear documentation for future contributors and maintainers

This practice ensures:
- Transparency in development decisions
- Historical context for future changes
- Clear communication of what was accomplished
- Alignment with project goals and requirements

Example change set structure:
```
# Feature: [Brief Title]
## Description
[Detailed explanation of the change]
## Acceptance Criteria
- [Specific requirement 1]
- [Specific requirement 2]
## Validation
[How the change was tested/verified]
```

## Recent Updates

- Added `DataContractProcessor` which validates `$file` references in API entities and inserts the YAML during catalog ingestion.
- Frontend plugin now registers a definition widget for APIs of type `datacontract`.

## Important

Use yarn for managing dependencies. Repository is monorepo, so also use related workspace command.
Before each commit run `yarn precommit` to lint, fix and format all files with BiomeJS.

For commits use conventional commits format
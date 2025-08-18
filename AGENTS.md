# Instructions for Contributors

This repository contains several [Backstage](https://backstage.io/) plugins. Any significant architectural decision or change
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

Additional documentation for significant architectural changes should be captured as **Architecture Decision Records (ADRs)** in the `adr/` directory. See the [ADR README](./adr/README.md) for the format and existing decisions:

- **Context**: The situation and forces that led to the decision
- **Decision**: The architectural decision that was made
- **Consequences**: The positive and negative consequences
- **Alternatives**: Other options considered and why they were rejected

Example changeset creation:
```bash
yarn changeset
# Follow prompts to select packages and change type
# Write summary: "Add data visualization component to improve UX"
```
## Important

Use yarn for managing dependencies. Repository is monorepo, so also use related workspace command.
Before each commit run `yarn precommit` to lint, fix and format all files with BiomeJS.

For commits use conventional commits format

Use playwright MCP for validation frontend implementation, start FE with `yarn start:fe`
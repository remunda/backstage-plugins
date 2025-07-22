# Backstage DataContract Plugin

This monorepo contains a Backstage plugin for ingesting and validating
[DataContract](https://datacontract.com/) YAML files. The plugin provides
both a backend service for validation and a frontend plugin for visualising the
contracts.

## Features

- Accepts `datacontract.yaml` referenced from Backstage API entities with the
  `$file:` syntax.
- Validates contracts against the official
  [DataContract specification](https://github.com/datacontract/datacontract-specification).
- Example backend router at `/ingest` that validates uploaded YAML.
- Frontend plugin prepared with styling similar to the
  [DataContract Editor](https://editor.datacontract.com/).

The repository is a Yarn workspaces monorepo and uses modern TypeScript.

## Development

Run `yarn install` at the repository root to install all dependencies. Each
package can be built using its `build` script.

Further architectural changes should be documented in `AGENTS.md` so that
other contributors and AI assistants (OpenAI Codex, GitHub Copilot, Claude)
can follow the decisions made.

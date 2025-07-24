# Backstage DataContract Plugin

This monorepo contains a Backstage plugin for ingesting and validating
[DataContract](https://datacontract.com/) YAML files. The plugin was scaffolded
with the Backstage CLI and split into backend and frontend packages managed with
Yarn workspaces.

## Features

- API entities can reference a `datacontract.yaml` using `$file:` in the
  `spec.definition` field.
- A custom catalog processor resolves the file reference, validates it against
  the official [DataContract specification](https://github.com/datacontract/datacontract-specification),
  and injects the raw YAML into the entity.
- The frontend plugin registers a custom API Docs definition widget
  (`DataContractDefinitionWidget`) to render DataContract YAML when
  `spec.type` is `datacontract`.
- Example backend router at `/ingest` that validates uploaded YAML.

The repository is a Yarn workspaces monorepo written in modern TypeScript.

## Development

Run `yarn install` at the repository root to install all dependencies. Each
package can be built using its `build` script.

Significant architectural changes should be documented in `AGENTS.md` so that
other contributors and AI assistants (OpenAI Codex, GitHub Copilot, Claude) can
follow the decisions made.

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
- The frontend plugin extends the API Docs definition widget to render
  DataContract content when `spec.type` is `datacontract`.
- Example backend router at `/ingest` that validates uploaded YAML.

The repository is a Yarn workspaces monorepo written in modern TypeScript.

## Development

Run `yarn install` at the repository root to install all dependencies. Each
package can be built using its `build` script.

### Change Documentation

Significant architectural changes should be documented in `AGENTS.md` so that
other contributors and AI assistants (OpenAI Codex, GitHub Copilot, Claude) can
follow the decisions made.

Additionally, all features and bug fixes should be documented as change sets in
the `.changes/` directory. Each change set should include:

- Clear description of the feature or bug fix
- Acceptance criteria defining what constitutes completion
- Validation evidence showing the change works as intended
- Context for future contributors and maintainers

See `.changes/initial-design.md` as an example of proper change set documentation.
This practice ensures transparency, traceability, and clear communication of
development progress.

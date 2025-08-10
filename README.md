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

### Quick Start

```bash
# Install dependencies
yarn install

# Start both frontend and backend in development
yarn start

# Build all packages
yarn build

# Run tests
yarn workspace @remunda/backstage-plugin-datacontract test
yarn workspace @remunda/backstage-plugin-datacontract-backend test
```

### Release Management

This repository uses **semantic-release** for automated versioning and publishing. All packages are released together with unified versioning. See [RELEASE.md](./RELEASE.md) for detailed information.

```bash
# Check current version (all packages use same version)
echo $(node -p "require('./package.json').version")

# Sync package versions manually if needed
yarn version:sync

# Test release process (dry run)
yarn release:dry

# Pack all packages for local testing
yarn local-publish
```

**Commit Message Format:**
- `feat:` → Minor release (1.0.0 → 1.1.0)
- `fix:` → Patch release (1.0.0 → 1.0.1)  
- `feat!:` or `BREAKING CHANGE:` → Major release (1.0.0 → 2.0.0)

Releases are automatically triggered when changes are pushed to main, or can be manually triggered via GitHub Actions.

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

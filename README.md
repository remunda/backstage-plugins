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

This repository uses **Changesets** for automated versioning and publishing. Each package can be versioned independently based on their individual changes. See [RELEASE.md](./RELEASE.md) for detailed information.

```bash
# Check current version (packages can have different versions)
yarn workspaces list --json

# Create a changeset for your changes
yarn changeset

# Version packages based on changesets (updates package.json and CHANGELOG.md)
yarn changeset:version

# Publish packages to npm
yarn changeset:publish

# Pack all packages for local testing
yarn local-publish
```

**Changeset Workflow:**
1. Make your changes to the codebase
2. Run `yarn changeset` to create a changeset describing your changes
3. Commit both your changes and the changeset file
4. When merged to main, GitHub Actions will automatically create a release PR
5. Merge the release PR to publish the packages

**Change Types:**
- `patch` → Bug fixes and small improvements (1.0.0 → 1.0.1)
- `minor` → New features (1.0.0 → 1.1.0)  
- `major` → Breaking changes (1.0.0 → 2.0.0)

Releases are automatically managed through GitHub Actions when changesets are present, or can be manually triggered via the release workflow.

### Change Documentation

Significant architectural changes should be documented in `AGENTS.md` so that
other contributors and AI assistants (OpenAI Codex, GitHub Copilot, Claude) can
follow the decisions made.

Additionally, all features and bug fixes should be documented using **Changesets**. When making changes, create a changeset using `yarn changeset` which will:

- Document the feature or bug fix clearly
- Specify the semver impact (patch/minor/major)
- Provide validation evidence showing the change works as intended
- Ensure proper versioning and changelog generation

This practice ensures transparency, traceability, and clear communication of
development progress through automated changelog generation.

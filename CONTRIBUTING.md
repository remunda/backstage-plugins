# Contributing

Thanks for your interest in contributing! This monorepo contains an open-source Backstage frontend and backend plugin for DataContracts. Please follow these guidelines to get started quickly and release safely.

## Prerequisites

- Node.js 20 or 22, Corepack enabled (Yarn v4)
- Yarn v4 (managed by Corepack)
- GitHub account for opening PRs

## Setup

```bash
yarn install
```

## Common scripts

```bash
# Type check all workspaces
yarn tsc

# Lint & format with Biome
yarn biome ci

# Run all tests
yarn test

# Start example dev setup (frontend + backend workspaces)
yarn start

# Build all workspaces
yarn build
```

## Making changes

1. Create a feature branch.
2. Implement your change with tests where practical.
3. Run the linters and tests locally:
   - `yarn precommit` or individually `yarn biome check --fix && yarn tsc && yarn test`
4. Create a Changeset describing the change and semver bump:
   - `yarn changeset`
5. Commit code and the generated `.changeset/*.md` file(s).

## Changesets and Releases

We use Changesets to version and publish packages independently. See `RELEASE.md` for the full workflow. The short version:

- Every user-visible change should include a changeset.
- When PRs are merged to `main`, the Release workflow opens/updates a release PR.
- Merging the release PR publishes to npm (requires `NPM_TOKEN`).

Useful commands:

```bash
yarn changeset           # create a changeset
yarn changeset:version   # apply version bumps (CI)
yarn changeset:publish   # publish to npm (CI)
```

## Backstage Directory Submission

To list the plugin in the Backstage Plugin Directory, ensure:

- Each package has a concise `README.md` with installation and usage.
- A permissive `LICENSE` (Apache-2.0 included in this repo).
- Clear contribution and release documentation (this file and `RELEASE.md`).
- CI passes (builds, tests), and published package contains built `dist` artifacts.

## Code style

- TypeScript, strict where possible.
- Keep public APIs stable; add tests when changing behavior.
- Prefer small, focused PRs with clear descriptions.

## Reporting issues

Open an issue with a minimal reproduction, expected/actual behavior, and environment details.

## Security

Do not include secrets in code or tests. Report security concerns privately via repository maintainers.

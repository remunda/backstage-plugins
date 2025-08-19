# ADR-003: Release with Changesets

## Status
Accepted

## Context
We initially considered semantic-release for automated versioning. The repository is a mono-repo with independently versioned packages and a desire to create a release PR for review before publishing.

## Decision
Adopt Changesets for versioning and publishing:

- Independent package versioning with clear change docs
- Human-authored changeset files reviewed in PRs
- Automated release PR and npm publish via GitHub Actions

## Consequences

Positive:
- Clearer release notes per package
- Fine-grained control of semver bumps
- Easy manual and CI flows

Negative:
- Additional step to create changesets

## Implementation

- `.changeset/config.json` configured with baseBranch `main`
- Release workflow `.github/workflows/release-changesets.yml`
- Contributor docs in `RELEASE.md` and `CONTRIBUTING.md`

## Related
- `RELEASE.md`
- `.changeset/*`

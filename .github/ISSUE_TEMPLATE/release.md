---
name: Release Request
about: Request a new release for all packages
title: 'Release Request: v[VERSION]'
labels: ['release']
assignees: []
---

## Release Details

**Current Version:** <!-- e.g., v0.1.0 -->
**Requested Version:** <!-- e.g., v0.2.0 -->
**Release Type:** <!-- patch/minor/major -->

## Changes Since Last Release

<!-- List the main changes, features, or fixes that will be included -->

- [ ] Feature 1
- [ ] Bug fix 1
- [ ] Breaking change 1

## Commit Messages

<!-- Ensure commits follow conventional format for automatic versioning -->

- [ ] All commits use conventional format (`feat:`, `fix:`, `BREAKING CHANGE:`)
- [ ] Commit messages accurately describe the impact
- [ ] Breaking changes are properly documented

## Pre-Release Checklist

- [ ] All tests are passing
- [ ] Documentation is updated
- [ ] CHANGELOG.md will be automatically updated
- [ ] All packages will be released with the same version

## Release Notes

<!-- Any additional context for the release notes -->

## Manual Release

If automatic release is not working, you can trigger manually:
1. Go to [Actions](../../actions)
2. Select "Release" workflow
3. Click "Run workflow"
4. Workflow will analyze commits and release if changes warrant it

## Note

All packages in the workspace (`@remunda/backstage-plugin-datacontract`, `@remunda/backstage-plugin-datacontract-backend`) will be released together with the same version using semantic-release.

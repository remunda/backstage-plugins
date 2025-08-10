# Release Process

This document describes the release process for the Backstage Data Contract plugins using semantic-release.

## Overview

This monorepo uses **semantic-release** to automatically version and publish all npm packages with the same version. All packages in the workspace are released together with unified versioning.

**Key Features:**
- ✅ Single version for all packages
- ✅ Automatic semantic versioning based on commit messages
- ✅ Unified git tag (e.g., `v1.2.3`)
- ✅ Automatic changelog generation
- ✅ NPM publishing with provenance
- ✅ Universal approach for adding more plugins

## Automated Releases

### Commit Message Format

Use [Conventional Commits](https://conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Version Impact:**
- `fix:` → Patch release (1.0.0 → 1.0.1)
- `feat:` → Minor release (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` or `!` → Major release (1.0.0 → 2.0.0)

**Examples:**
```bash
feat: add new data visualization component
fix: resolve issue with YAML parsing
feat!: change API interface (breaking change)
```

### Release Process

1. **Commit with conventional format** to main branch
2. **Semantic-release analyzes** commit messages since last release
3. **Version is determined** automatically (patch/minor/major)
4. **Changelog is generated** from commit messages
5. **Git tag is created** (e.g., `v1.2.3`)
6. **All workspace packages** are updated to the same version
7. **Packages are built** and published to npm
8. **GitHub release** is created with changelog

### Manual Release

You can trigger a release manually via GitHub Actions:
1. Go to **Actions** tab in GitHub
2. Select **"Release"** workflow
3. Click **"Run workflow"**
4. The workflow will process commits and release if needed

## Package Versioning

All packages share the same version:
- `@remunda/backstage-plugin-datacontract`
- `@remunda/backstage-plugin-datacontract-backend`

**Git Tags:** Single tag format `v1.2.3` (no package prefixes)

## Adding New Plugins

The release system is universal. To add a new plugin:

1. **Create plugin** in `plugins/` directory
2. **Add to workspace** (already configured with `plugins/*`)
3. **Configure package.json** with proper `publishConfig`:
   ```json
   {
     "publishConfig": {
       "access": "public",
       "main": "dist/index.*.js",
       "types": "dist/index.d.ts"
     }
   }
   ```
4. **Plugin is automatically included** in next release

## Setup Requirements

### NPM Token
Add `NPM_TOKEN` secret to GitHub repository:
- Create automation token at https://www.npmjs.com/settings/tokens
- Add as repository secret in GitHub Settings

### Repository Permissions
Ensure GitHub Actions have:
- Contents: write
- Issues: write
- Pull requests: write
- ID token: write

## Local Development

```bash
# Check current version
echo $(node -p "require('./package.json').version")

# Sync all package versions manually
yarn version:sync

# Dry run semantic-release
yarn release:dry

# Pack all packages for testing
yarn local-publish
```

## Configuration Files

- **`.releaserc.json`** - Semantic-release configuration
- **`scripts/sync-versions.js`** - Version synchronization script
- **`CHANGELOG.md`** - Main project changelog
- **`.github/workflows/release.yml`** - Release workflow

## Rollback

To rollback a release:
1. **Unpublish** packages from npm (within 72 hours)
2. **Delete git tag**: `git tag -d v1.2.3 && git push --delete origin v1.2.3`
3. **Delete GitHub release**
4. **Revert commits** if necessary

## Troubleshooting

### No Release Created
- Check commit messages follow conventional format
- Ensure commits contain releasable changes (feat/fix/BREAKING CHANGE)
- Run `yarn release:dry` to test locally

### Failed NPM Publish
- Verify NPM_TOKEN is valid and has publish permissions
- Check package versions don't already exist on npm
- Ensure all `publishConfig` sections are correct

### Version Sync Issues
- Run `yarn version:sync` to manually synchronize versions
- Check all package.json files for consistency

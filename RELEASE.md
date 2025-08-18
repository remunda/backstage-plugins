# Release Process

This document describes the release process for the Backstage plugins using Changesets.

## Overview

This monorepo uses **Changesets** to manage versioning and publishing of npm packages. Each package can be versioned independently based on their individual changes, allowing for more flexible release management.

**Key Features:**
- ✅ Independent versioning for each package
- ✅ Explicit change documentation via changeset files
- ✅ Automatic changelog generation per package
- ✅ NPM publishing with provenance
- ✅ GitHub integration for release PR management
- ✅ Simple addition of new plugins

## Automated Releases

### Changeset Workflow

1. **Make your changes** to the codebase
2. **Create a changeset** using `yarn changeset`
3. **Commit your changes** along with the changeset file
4. **Push to main branch** or create a PR
5. **Changesets Action** automatically creates a release PR
6. **Merge the release PR** to publish packages

### Creating Changesets

When you make changes that should trigger a release, create a changeset:

```bash
yarn changeset
```

This will prompt you to:
1. **Select packages** affected by your changes
2. **Choose semver bump type** (patch/minor/major) for each package
3. **Write a summary** of the changes

**Change Types:**
- `patch` → Bug fixes and small improvements (1.0.0 → 1.0.1)
- `minor` → New features and additions (1.0.0 → 1.1.0)
- `major` → Breaking changes (1.0.0 → 2.0.0)

### Example Changeset

A changeset file looks like this:
```markdown
---
"@remunda/backstage-plugin-datacontract": minor
"@remunda/backstage-plugin-datacontract-backend": patch
---

Add new data visualization component

This adds support for rendering charts in the DataContract widget, 
improving the user experience when viewing data quality metrics.
```

### Release Process

1. **Changesets are merged** to main branch
2. **GitHub Action** detects changeset files
3. **Release PR is created** with version bumps and changelog updates
4. **Review and merge** the release PR
5. **Packages are automatically published** to npm
6. **GitHub releases** are created with changelogs

### Manual Release Trigger

You can trigger releases manually via GitHub Actions:
1. Go to **Actions** tab in GitHub
2. Select **"Release with Changesets"** workflow
3. Click **"Run workflow"**

## Package Versioning

Packages can have independent versions:
- `@remunda/backstage-plugin-datacontract` (e.g., v2.1.0)
- `@remunda/backstage-plugin-datacontract-backend` (e.g., v1.3.2)

**Git Tags:** Separate tags per package (e.g., `@remunda/backstage-plugin-datacontract@2.1.0`)

## Adding New Plugins

The release system automatically includes new plugins:

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
4. **Create changeset** when ready to release
5. **Plugin is included** in release process

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
# Check current versions
yarn workspaces list --json

# Create a changeset
yarn changeset

# Version packages based on changesets (updates package.json and CHANGELOG.md)
yarn changeset:version

# Publish packages (usually done by CI)
yarn changeset:publish

# Pack all packages for testing
yarn local-publish
```

## Configuration Files

- **`.changeset/config.json`** - Changesets configuration
- **`.changeset/*.md`** - Individual changeset files
- **`CHANGELOG.md`** - Per-package changelogs
- **`.github/workflows/release-changesets.yml`** - Release workflow

## Release States

### Pre-release Workflow
For alpha/beta releases:
```bash
# Enter pre-release mode
yarn changeset pre enter alpha

# Create changesets as normal
yarn changeset

# Version and publish pre-releases
yarn changeset:version
yarn changeset:publish

# Exit pre-release mode when ready
yarn changeset pre exit
```

### Rollback

To rollback a release:
1. **Unpublish** packages from npm (within 72 hours)
2. **Revert the release commit**
3. **Create a new changeset** with a patch to fix issues

## Troubleshooting

### No Release PR Created
- Ensure changeset files exist in `.changeset/` directory
- Check that changesets reference existing packages
- Verify GitHub Action has proper permissions

### Failed NPM Publish
- Verify NPM_TOKEN is valid and has publish permissions
- Check package versions don't already exist on npm
- Ensure all `publishConfig` sections are correct

### Changeset Not Detected
- Confirm changeset file follows proper format
- Check that package names in changeset match actual package names
- Ensure changeset has been committed to repository

# GitHub Workflows

This directory contains GitHub Actions workflows for CI/CD and automated releases using semantic-release.

## Workflows

### CI (`ci.yml`)
Runs on every push and pull request to `main` and `develop` branches:
- **Check & Lint**: Runs TypeScript compilation and Biome linting
- **Test**: Runs tests for each workspace package
- **Build**: Builds each workspace package and uploads artifacts

### Release (`release.yml`)
Handles automatic semantic versioning and publishing using semantic-release:
- **Automatic**: Triggered on push to `main` branch
- **Manual**: Can be triggered via GitHub Actions UI
- **Features**:
  - Unified versioning for all packages
  - Automatic version determination from commit messages
  - Single git tag per release (e.g., `v1.2.3`)
  - Changelog generation
  - NPM publishing with provenance
  - Universal approach for any number of plugins

### Dependency Update (`dependency-update.yml`)
Automatically updates dependencies:
- Runs weekly on Mondays at 9 AM UTC
- Updates all dependencies using `yarn up '*'`
- Creates pull requests with dependency updates

## Setup Requirements

### NPM Token
Add the following secret to your GitHub repository:
- `NPM_TOKEN`: Your NPM automation token with publish permissions

### Commit Message Convention
Use [Conventional Commits](https://conventionalcommits.org/) format:
- `feat:` - triggers minor version bump (1.0.0 → 1.1.0)
- `fix:` - triggers patch version bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` or `!:` - triggers major version bump (1.0.0 → 2.0.0)

**Examples:**
```
feat: add new data visualization component
fix: resolve YAML parsing issue
feat!: change API interface (breaking change)
```

### Manual Release
You can manually trigger releases via GitHub Actions:
1. Go to Actions tab in GitHub
2. Select "Release" workflow
3. Click "Run workflow"
4. Workflow analyzes commits and releases if needed

## Package Versioning

All packages share the same version and are released together:
- `@remunda/backstage-plugin-datacontract`
- `@remunda/backstage-plugin-datacontract-backend`
- Any future plugins added to `plugins/` directory

**Git tags:** Single tag format `v1.2.3` (no package prefixes)

## Adding New Plugins

The system is designed to be universal. To add a new plugin:

1. Create plugin directory in `plugins/`
2. Add proper `publishConfig` to package.json:
   ```json
   {
     "publishConfig": {
       "access": "public",
       "main": "dist/index.*.js",
       "types": "dist/index.d.ts"
     }
   }
   ```
3. Plugin is automatically included in releases

## Semantic Release Configuration

- **`.releaserc.json`** - Main semantic-release configuration
- **`scripts/sync-versions.js`** - Synchronizes versions across workspace packages
- **`CHANGELOG.md`** - Project-wide changelog

## Publishing

All packages are published to NPM with:
- Unified version across all packages
- Public access (`--access public`)
- Provenance information (`--provenance`)
- Automatic changelog generation
- Single git tag per release

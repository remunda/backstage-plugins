# Semantic Release Workflow Setup Summary

This document summarizes the semantic-release based workflow setup for unified versioning and publishing of all Backstage Data Contract plugins.

## 🚀 What Was Created

### Core Configuration

1. **`.releaserc.json`** - Semantic-release configuration
   - Automatic version determination from conventional commits
   - Changelog generation
   - Git tagging and GitHub releases
   - NPM publishing disabled (handled separately)

2. **`scripts/sync-versions.js`** - Version synchronization script
   - Syncs version from root package.json to all workspace packages
   - Handles automatic version alignment

### GitHub Workflows (`.github/workflows/`)

3. **`ci.yml`** - Continuous Integration (unchanged)
   - Runs on every push/PR to main/develop
   - TypeScript compilation, linting with Biome
   - Tests and builds for each workspace package

4. **`release.yml`** - Unified Release & Publishing
   - Uses semantic-release for version determination
   - Single git tag per release (e.g., `v1.2.3`)
   - Publishes all packages with same version
   - Universal approach for any number of plugins

5. **`dependency-update.yml`** - Dependency Management (unchanged)
   - Weekly automatic dependency updates

### Package Configuration Updates

6. **Root `package.json`**
   - Removed `private: true` to enable semantic-release
   - Added semantic-release dependencies
   - Updated scripts for new workflow

7. **Workspace packages**
   - Both packages use same version (0.1.0)
   - Proper publishConfig maintained

### Documentation Updates

8. **`RELEASE.md`** - Updated for semantic-release approach
9. **`CHANGELOG.md`** - Main project changelog
10. **`.github/workflows/README.md`** - Updated workflow documentation
11. **Updated main `README.md`** - New release management section
12. **GitHub templates** - Updated for unified versioning

## 📦 Unified Versioning Model

**Before:**
- Independent versioning per package
- Multiple git tags (`frontend-v1.2.3`, `backend-v1.2.3`)
- Complex release management

**After:**
- ✅ Single version for all packages
- ✅ Single git tag per release (`v1.2.3`)
- ✅ Automatic semantic versioning
- ✅ Universal approach for any number of plugins

## 🔧 Key Features

### Automatic Release Process
1. **Commit** with conventional format to main branch
2. **Semantic-release** analyzes commits and determines version
3. **Single git tag** created (e.g., `v1.2.3`)
4. **All packages** updated to same version
5. **Packages built** and published to npm
6. **GitHub release** created with changelog

### Conventional Commits
- `feat:` → Minor release (1.0.0 → 1.1.0)
- `fix:` → Patch release (1.0.0 → 1.0.1)
- `feat!:` or `BREAKING CHANGE:` → Major release (1.0.0 → 2.0.0)

### Universal Plugin Support
- Works with any number of plugins in `plugins/` directory
- Automatic discovery of workspace packages
- No configuration changes needed for new plugins

## 🎯 Benefits

- ✅ **Unified versioning** - All packages always have same version
- ✅ **Simplified tagging** - Single git tag per release
- ✅ **Automatic versioning** - Based on commit messages
- ✅ **Universal scalability** - Easy to add more plugins
- ✅ **Consistent releases** - All packages released together
- ✅ **Standard tooling** - Uses industry-standard semantic-release

## 🚦 How to Use

### For Developers
```bash
# Make changes and commit with conventional format
git commit -m "feat: add new visualization component"
git push origin main
# → Triggers automatic minor release

# Check current version
echo $(node -p "require('./package.json').version")

# Sync versions manually if needed
yarn version:sync

# Test release process
yarn release:dry
```

### For Adding New Plugins
1. Create plugin in `plugins/new-plugin/`
2. Add proper `publishConfig` to package.json
3. Plugin automatically included in next release
4. No workflow changes needed

## 🔄 Migration Benefits

**From the previous approach:**
- Eliminates complexity of managing separate package versions
- Removes need for separate git tags per package
- Simplifies release workflows
- Provides better consistency for consumers
- Makes it trivial to add new plugins

**Maintains:**
- All existing CI/CD features
- NPM publishing with provenance
- GitHub releases and changelogs
- Local development workflows

## 📋 Setup Requirements

1. **NPM Token** - Add `NPM_TOKEN` to GitHub repository secrets
2. **Conventional Commits** - Use proper commit message format
3. **Repository Permissions** - Ensure GitHub Actions have write access

The setup is now ready for unified semantic releases with automatic versioning based on conventional commits!

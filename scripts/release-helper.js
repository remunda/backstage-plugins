#!/usr/bin/env node

/**
 * Local Release Helper Script
 * 
 * This script helps with local testing of the release process
 * and manual version bumping when needed.
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const WORKSPACES = [
  {
    name: '@remunda/backstage-plugin-datacontract',
    path: 'plugins/datacontract',
    prefix: 'frontend'
  },
  {
    name: '@remunda/backstage-plugin-datacontract-backend',
    path: 'plugins/datacontract-backend',
    prefix: 'backend'
  }
];

function getCurrentVersion(workspacePath) {
  const packagePath = path.join(workspacePath, 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  return pkg.version;
}

function updateVersion(workspacePath, newVersion) {
  const packagePath = path.join(workspacePath, 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  pkg.version = newVersion;
  writeFileSync(packagePath, JSON.stringify(pkg, null, '\t') + '\n');
}

function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`;
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`;
    case 'patch':
    default:
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
}

function exec(command, cwd = process.cwd()) {
  console.log(`$ ${command}`);
  return execSync(command, { cwd, stdio: 'inherit' });
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'status':
      console.log('Current package versions:');
      WORKSPACES.forEach(workspace => {
        const version = getCurrentVersion(workspace.path);
        console.log(`  ${workspace.name}: v${version}`);
      });
      break;

    case 'bump': {
      const bumpType = args[1] || 'patch';
      const packageFilter = args[2];
      
      if (!['major', 'minor', 'patch'].includes(bumpType)) {
        console.error('Invalid bump type. Use: major, minor, or patch');
        process.exit(1);
      }

      const workspacesToBump = packageFilter 
        ? WORKSPACES.filter(w => w.name.includes(packageFilter))
        : WORKSPACES;

      workspacesToBump.forEach(workspace => {
        const currentVersion = getCurrentVersion(workspace.path);
        const newVersion = bumpVersion(currentVersion, bumpType);
        
        console.log(`Bumping ${workspace.name} from v${currentVersion} to v${newVersion}`);
        updateVersion(workspace.path, newVersion);
        
        // Build the package
        console.log(`Building ${workspace.name}...`);
        exec(`yarn workspace ${workspace.name} build`);
      });
      break;
    }

    case 'pack': {
      const packPackage = args[1];
      const workspaceToPack = packPackage 
        ? WORKSPACES.find(w => w.name.includes(packPackage))
        : null;

      if (packPackage && !workspaceToPack) {
        console.error(`Package containing "${packPackage}" not found`);
        process.exit(1);
      }

      const workspacesToPack = workspaceToPack ? [workspaceToPack] : WORKSPACES;

      workspacesToPack.forEach(workspace => {
        console.log(`Packing ${workspace.name}...`);
        exec(`yarn workspace ${workspace.name} pack --out local-publish/`, workspace.path);
      });
      break;
    }

    case 'help':
    default:
      console.log(`
Usage: node scripts/release-helper.js <command> [options]

Commands:
  status                    Show current package versions
  bump [type] [package]     Bump version and build (type: major|minor|patch, package: filter)
  pack [package]            Pack packages for local testing
  help                      Show this help

Examples:
  node scripts/release-helper.js status
  node scripts/release-helper.js bump patch
  node scripts/release-helper.js bump minor frontend
  node scripts/release-helper.js pack backend
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { getCurrentVersion, updateVersion, bumpVersion };

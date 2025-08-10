#!/usr/bin/env node

/**
 * Version Synchronization Script
 * 
 * This script synchronizes the version from the root package.json
 * to all workspace packages, ensuring they all use the same version.
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

function getCurrentVersion() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  return pkg.version;
}

function updateWorkspaceVersions(version) {
  console.log(`Synchronizing all workspace packages to version ${version}`);
  
  try {
    // Get list of workspace packages
    const workspaces = execSync('yarn workspaces list --json', { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .filter(workspace => workspace.location !== '.');

    for (const workspace of workspaces) {
      const packagePath = path.join(workspace.location, 'package.json');
      
      try {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
        const oldVersion = pkg.version;
        
        pkg.version = version;
        writeFileSync(packagePath, JSON.stringify(pkg, null, '\t') + '\n');
        
        console.log(`Updated ${workspace.name}: ${oldVersion} → ${version}`);
      } catch (error) {
        console.error(`Failed to update ${workspace.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Failed to get workspace list:', error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const targetVersion = args[0];

  if (!targetVersion) {
    const currentVersion = getCurrentVersion();
    console.log(`Current root version: ${currentVersion}`);
    console.log('Synchronizing workspace packages to match root version...');
    updateWorkspaceVersions(currentVersion);
  } else {
    console.log(`Setting all packages to version: ${targetVersion}`);
    
    // Update root package.json
    const rootPackagePath = path.join(process.cwd(), 'package.json');
    const rootPkg = JSON.parse(readFileSync(rootPackagePath, 'utf8'));
    rootPkg.version = targetVersion;
    writeFileSync(rootPackagePath, JSON.stringify(rootPkg, null, '\t') + '\n');
    
    // Update workspace packages
    updateWorkspaceVersions(targetVersion);
  }
  
  console.log('Version synchronization complete!');
}

if (require.main === module) {
  main();
}

module.exports = { getCurrentVersion, updateWorkspaceVersions };

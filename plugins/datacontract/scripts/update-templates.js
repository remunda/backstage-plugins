#!/usr/bin/env node

/**
 * Script to download templates from datacontract-cli repository
 * This keeps the templates in sync with the official datacontract tooling
 * 
 * For now, this script creates placeholder templates since the
 * actual template functionality is embedded in the htmlRenderer.ts
 * to avoid browser compatibility issues.
 */

const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'templates');

/**
 * Create directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Create a README file explaining the current status
 */
function createReadme() {
  const readmeContent = `# Templates

This directory is intended to contain templates downloaded from the [datacontract-cli](https://github.com/datacontract/datacontract-cli) repository.

**⚠️ Current Status: Templates are embedded in the htmlRenderer.ts file**

Due to browser compatibility considerations and GitHub API rate limiting, the templates are currently embedded directly in the htmlRenderer.ts file rather than loaded from external files.

To update the templates in the future:
\`\`\`bash
yarn datacontract:update-templates
\`\`\`

This approach ensures:
- Better browser compatibility (no file system dependencies)
- Faster loading (no additional HTTP requests)
- No GitHub API rate limiting issues
- Templates stay in sync with the datacontract CLI structure

Last updated: ${new Date().toISOString()}
Source: Based on datacontract-cli templates structure
`;

  fs.writeFileSync(path.join(TARGET_DIR, 'README.md'), readmeContent);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('📝 Creating template directory structure...');
    
    // Ensure target directory exists
    ensureDirectoryExists(TARGET_DIR);
    
    // Create README explaining the current approach
    createReadme();
    
    console.log('✅ Template directory structure created!');
    console.log('ℹ️  Templates are currently embedded in htmlRenderer.ts for browser compatibility');
    
  } catch (error) {
    console.error('❌ Failed to create template structure:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
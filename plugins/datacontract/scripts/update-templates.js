#!/usr/bin/env node

/**
 * Portions of this file are based on the approach used in the
 * datacontract-editor project (MIT License)
 * https://github.com/datacontract/datacontract-editor/blob/main/scripts/load_templates.js
 *
 * Copyright (c) 2023 innoQ Deutschland GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Script to download templates from datacontract-cli repository
 * This keeps the templates in sync with the official datacontract tooling
 *
 * Based on the approach used in datacontract-editor repository:
 * https://github.com/datacontract/datacontract-editor/blob/main/scripts/load_templates.js
 */

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const BASE_URL =
	"https://raw.githubusercontent.com/datacontract/datacontract-cli/main/datacontract/templates/";
const TARGET_DIR = path.join(__dirname, "..", "templates");

/**
 * Create directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

/**
 * Download a file from URL
 */
function downloadFile(url) {
	return new Promise((resolve, reject) => {
		https
			.get(url, (response) => {
				if (response.statusCode !== 200) {
					reject(
						new Error(`Failed to download ${url}: ${response.statusCode}`),
					);
					return;
				}

				let data = "";
				response.on("data", (chunk) => {
					data += chunk;
				});

				response.on("end", () => {
					resolve(data);
				});
			})
			.on("error", (err) => {
				reject(err);
			});
	});
}

/**
 * Update template code from Python to JavaScript syntax
 * Based on datacontract-editor's approach
 */
function updateTemplateCode(template) {
	return template
		.replace(/\.items\(\)/gm, "")
		.replace(/True/gm, "true")
		.replace(/False/gm, "false")
		.replace(/\.ref/gm, ".$ref")
		.replace(/cli\.datacontract\.com/gm, "editor.datacontract.com")
		.replace(/Data Contract CLI/gm, "Data Contract Editor");
}

/**
 * Store template to file
 */
function storeTemplate(filepath, content) {
	fs.writeFileSync(filepath, content, { encoding: "utf-8" });
}

/**
 * Download and process a template file
 */
async function processTemplate(templatePath) {
	const url = BASE_URL + templatePath;
	console.log(`📥 Downloading ${templatePath}...`);

	const template = await downloadFile(url);
	const processedTemplate = updateTemplateCode(template);

	return processedTemplate;
}

/**
 * Main function
 */
async function main() {
	try {
		console.log("🚀 Downloading templates from datacontract-cli...");

		// Ensure target directories exist
		ensureDirectoryExists(TARGET_DIR);
		ensureDirectoryExists(path.join(TARGET_DIR, "partials"));

		// Download main template first
		const mainTemplate = await processTemplate("datacontract.html");

		// Extract the <main> content from the full template
		const mainContentMatch = mainTemplate.match(/<main[^>]*>.*<\/main>/s);
		if (!mainContentMatch) {
			throw new Error("Could not find <main> element in datacontract.html");
		}
		const mainContent = mainContentMatch[0];

		// Store main template
		storeTemplate(path.join(TARGET_DIR, "datacontract.html"), mainContent);

		// Find all partial references in the main template
		const partialRegex = /partial\('([\w/.]+)'/g;
		const partials = Array.from(
			mainContent.matchAll(partialRegex),
			(m) => m[1],
		);

		console.log(
			`📋 Found ${partials.length} partial templates: ${partials.join(", ")}`,
		);

		// Download and process all partials
		const templates = { "datacontract.html": mainContent };

		for (const partial of partials) {
			const partialTemplate = await processTemplate(partial);
			storeTemplate(path.join(TARGET_DIR, partial), partialTemplate);
			templates[partial] = partialTemplate;
		}

		console.log("✅ Templates downloaded and processed successfully!");
		console.log(`📁 Templates saved to: ${TARGET_DIR}`);
	} catch (error) {
		console.error("❌ Failed to download templates:", error.message);
		process.exit(1);
	}
}

// Run the script
if (require.main === module) {
	main();
}

module.exports = { main };

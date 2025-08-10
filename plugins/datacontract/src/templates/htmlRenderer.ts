import yaml from "js-yaml";
import nunjucks from "nunjucks";

// Add type declaration for window
declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: Nunjucks precompiled templates can contain any compiled function
		nunjucksPrecompiled?: Record<string, any>;
	}
}

// Import templates - this will execute the file and set up window.nunjucksPrecompiled
try {
	require("./templates.generated.js");
} catch (error) {
	console.warn("Could not load precompiled templates:", error);
}

/*
 * Rendering with nunjucks using precompiled templates.
 * Requires "npm run precompile" to have the templates available
 */

// Initialize environment with precompiled loader lazily
let env: nunjucks.Environment | null = null;

function getOrCreateEnvironment(): nunjucks.Environment {
	if (env) {
		return env;
	}

	// Check if precompiled templates are available
	const hasPrecompiledTemplates =
		typeof window !== "undefined" &&
		window &&
		window.nunjucksPrecompiled &&
		Object.keys(window.nunjucksPrecompiled).length > 0;

	if (!hasPrecompiledTemplates) {
		throw new Error(
			'Template system not initialized. Run "yarn datacontract:update-templates" to download and precompile templates.',
		);
	}

	env = new nunjucks.Environment(
		// biome-ignore lint/suspicious/noExplicitAny: Nunjucks types don't include PrecompiledLoader
		new (nunjucks as any).PrecompiledLoader(window.nunjucksPrecompiled),
		{ autoescape: false },
	);

	env.addGlobal(
		"render_partial",
		(partialName: string, context: object | undefined) =>
			env?.render(partialName, context) || "",
	);
	// biome-ignore lint/suspicious/noExplicitAny: have no control over the type here
	env.addGlobal("range", (from: number, to: any) =>
		[...Array(to).keys()].map((i) => i + from),
	);

	return env;
}

export function renderDataContract(dataContractYaml: string): string {
	const json = yaml.load(dataContractYaml);
	if (typeof json !== "object" || json === null) {
		throw new Error("Invalid data contract definition format");
	}

	const environment = getOrCreateEnvironment();
	const local_date = new Date().toLocaleDateString();
	return environment.render("datacontract.html", {
		datacontract: json,
		formatted_date: local_date,
		datacontract_cli_version: "n/a",
	});
}

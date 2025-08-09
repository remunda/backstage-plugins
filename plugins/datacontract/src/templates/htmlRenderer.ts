import yaml from "js-yaml";
import nunjucks from "nunjucks";
import "./templates.generated.js";

/*
 * Rendering with nunjucks using precompiled templates.
 * Requires "npm run precompile" to have the templates available
 */

// Initialize environment with precompiled loader
const env = new nunjucks.Environment(
	new (nunjucks as any).PrecompiledLoader((window as any).nunjucksPrecompiled),
	{ autoescape: false }
);

env.addGlobal(
	"render_partial",
	(partialName: string, context: object | undefined) =>
		env.render(partialName, context),
);
// biome-ignore lint/suspicious/noExplicitAny: have no control over the type here
env.addGlobal("range", (from: number, to: any) =>
	[...Array(to).keys()].map((i) => i + from),
);

export function renderDataContract(dataContractYaml: string): string {
	const json = yaml.load(dataContractYaml);
	if (typeof json !== "object" || json === null) {
		throw new Error("Invalid data contract definition format");
	}

	const local_date = new Date().toLocaleDateString();
	return env.render("datacontract.html", {
		datacontract: json,
		formatted_date: local_date,
		datacontract_cli_version: "n/a",
	});
}

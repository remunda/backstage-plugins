const { default: original } = require("@changesets/cli/changelog");

async function getDependencyReleaseLine(_changesets, dependenciesUpdated) {
	if (dependenciesUpdated.length === 0) return "";

	const updatedDependenciesList = dependenciesUpdated.map(
		(dependency) => `  - ${dependency.name}@${dependency.newVersion}`,
	);

	// Simpler list of updated dependencies
	return ["- Updated dependencies", ...updatedDependenciesList].join("\n");
}

module.exports = {
	getDependencyReleaseLine,
	getReleaseLine: original.getReleaseLine,
};

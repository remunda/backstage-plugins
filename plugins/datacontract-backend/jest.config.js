const rootConfig = require("@backstage/cli/config/jest");

module.exports = {
	...rootConfig,
	transform: {
		...rootConfig.transform,
		"^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
	},
};

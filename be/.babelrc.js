#!/usr/bin/env node

module.exports = (api) => {
	api.assertVersion("^7.2");
	api.cache.never();
	return {
		"plugins": [
			[ "@babel/plugin-proposal-class-properties", {}, ],
			[ "@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true, }, ],
			[ "@babel/plugin-proposal-do-expressions", {}, ],
			[ "@babel/plugin-proposal-export-default-from", {}, ],
			[ "@babel/plugin-proposal-export-namespace-from", {}, ],
			[ "@babel/plugin-proposal-function-bind", {}, ],
			[ "@babel/plugin-proposal-function-sent", {}, ],
			[ "@babel/plugin-proposal-logical-assignment-operators", {}, ],
			[ "@babel/plugin-proposal-nullish-coalescing-operator", {}, ],
			[ "@babel/plugin-proposal-numeric-separator", {}, ],
			[ "@babel/plugin-proposal-optional-chaining", {}, ],
			[ "@babel/plugin-proposal-partial-application", {}, ],
			[ "@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal", }, ],
			[ "@babel/plugin-proposal-private-methods", {}, ],
			[ "@babel/plugin-proposal-private-property-in-object", {}, ],
			[ "@babel/plugin-proposal-throw-expressions", {}, ],
			[ "@babel/plugin-transform-arrow-functions", {}, ],
			[ "@babel/plugin-transform-exponentiation-operator", {}, ],
			[ "@babel/plugin-transform-property-literals", {}, ],
			[ "@babel/plugin-transform-property-mutators", {}, ],
			[ "@babel/plugin-transform-reserved-words", {}, ],
			[ "@babel/plugin-transform-runtime", {}, ],
			[ "babel-plugin-operator-overloading", {}, ],
			// [ "minify-builtins", {}, ],
			// [ "transform-inline-consecutive-adds", {}, ],
			// [ "transform-inline-environment-variables", {}, ],
			// [ "transform-merge-sibling-variables", {}, ],
			// [ "transform-minify-booleans", {}, ],
		],
		"presets": [
				[ "@babel/preset-env", {
					"debug": false, //!api.env("production"),
					"targets": { "esmodules": true, "node": true, },
					// "useBuiltIns": "entry",
				}, ],
				// [ "@babel/preset-env", {
				// 	"debug": false,
				// 	"targets": "> 0.25%, not dead",
				// 	"useBuiltIns": "entry",
				// }, ],
				// [ "@babel/preset-typescript", {}, ],
		],
	};
};

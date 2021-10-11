module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{png,svg,css,html,js,json}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};
const
	express = require('express'),
	fetch = require('node-fetch'),
	penthouse = require('penthouse'),
	server = express(),

	SERVER_PORT = 3000,
	SERVER_PATH = '/',

	// See available options: https://github.com/pocketjoso/penthouse#options
	PENTHOUSE_ALLOWED_OPTIONS = {
		width: {type: 'number'},
		height: {type: 'number'},
		keepLargerMediaQueries: {type: 'boolean'},
		forceInclude: {type: 'array'},
		propertiesToRemove: {type: 'array'},
		timeout: {type: 'number'},
		pageLoadSkipTimeout: {type: 'number'},
		renderWaitTime: {type: 'number'},
		blockJSRequests: {type: 'number'},
		maxEmbeddedBase64Length: {type: 'number'},
		userAgent: {type: 'string'}
	}
;


async function fetchCss(css) {
	return fetch(css).then(res => {
		return res.text();
	});
}

async function fetchCritical(options) {
	return penthouse(options);
}

function castToType(value, type) {
	if (typeof value === type) {
		return value;
	}

	switch (type) {
		case 'number':
			return parseFloat(value.toString(), 10);
		case 'boolean':
			return value.toString().toLowerCase() === 'true';
		case 'array':
			return Array.isArray(value) ? value : Array(value);
		default:
			return value.toString();
	}
}

function parseOptions(query) {
	var options = {};
	Object.keys(PENTHOUSE_ALLOWED_OPTIONS).forEach(key => {
		if (key in query) {
			const option = PENTHOUSE_ALLOWED_OPTIONS[key];
			const value = castToType(query[key], option.type);
			options[key] = value;
		}
	});

	return options;
}

async function handleRequest(request, response) {
	const {url, css} = request.query;

	if (!css || !url) {
		response.status(400).send('Missing correct params (url, css).');
		return;
	}

	try {
		const
			options = parseOptions(request.query),
			cssString = await fetchCss(css),
			critical = await fetchCritical({...options, url, cssString})
		;

		response.send(critical);
	} catch(error) {
		console.error(error); // eslint-disable-line no-console
		response.status(500).send('Error: ' + error.message);
	}
}

server
	.get(SERVER_PATH, handleRequest)
	.listen(SERVER_PORT, () =>
		console.log('Penthouse service is listening...')); // eslint-disable-line no-console

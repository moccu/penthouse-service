const
	child_process = require('child_process'),
	express = require('express'),
	utils = require('./utils'),
	server = express(),

	SERVER_PORT = 3000,
	SERVER_PATH = '/',

	PROCESS_FETCHCSS = __dirname + '/process/fetchcss.js',
	PROCESS_PENTHOUSE = __dirname + '/process/penthouse.js',

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


function subprocess(file, data) {
	return new Promise((resolve, reject) => {
		var process = child_process.fork(file);
		process.on('message', (message) => {
			process.kill('SIGINT');
			resolve(message);
		});
		process.on('error', (error) => {
			process.kill('SIGINT');
			reject(error);
		});
		process.send(data);
	});
}


server
	.get(SERVER_PATH, async (request, response) => {
		const {url, css} = request.query;

		if (!css || !url) {
			response.status(400).send('Missing correct params (url, css).');
			return;
		}

		try {
			const options = utils.parse(request.query, PENTHOUSE_ALLOWED_OPTIONS);
			const cssString = await subprocess(PROCESS_FETCHCSS, {css});
			const critical = await subprocess(PROCESS_PENTHOUSE, {...options, url, cssString});
			response.send(critical);
		} catch(error) {
			console.error(error); // eslint-disable-line no-console
			response.status(500).send('Error: ' + error.message);
		}
	})
	.listen(SERVER_PORT, () =>
		console.log('Penthouse service is listening on port ' + SERVER_PORT)); // eslint-disable-line no-console

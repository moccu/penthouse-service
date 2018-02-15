const
	express = require('express'),
	fetch = require('node-fetch'),
	penthouse = require('penthouse'),
	server = express(),

	SERVER_PORT = 3000,
	SERVER_PATH = '/'
;


async function fetchCss(css) {
	return fetch(css).then(res => {
		return res.text()
	});
}

async function fetchCritical(url, cssString) {
	return penthouse({url, cssString});
}

async function handleRequest(request, response) {
	const {url, css} = request.query;

	if (!css || !url) {
		response.status(400).send('Missing correct params (url, css).');
		return;
	}

	try {
		const
			cssString = await fetchCss(css),
			critical = await fetchCritical(url, cssString)
		;

		response.send(critical);
	} catch(error) {
		console.error(error);
		response.status(500).send('Error: ' + error.message);
	}
}

server
	.get(SERVER_PATH, handleRequest)
	.listen(SERVER_PORT, () => console.log('Penthouse service is listening...'));

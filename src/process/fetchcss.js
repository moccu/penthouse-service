const fetch = require('node-fetch');


process.on('message', (options) => {
	fetch(options.css)
		.then((response) => {
			if (response.ok) {
				return response.text();
			}

			throw new Error(response.statusText);
		})
		.then((css) => process.send({css}))
		.catch((error) => process.send({error}));
});

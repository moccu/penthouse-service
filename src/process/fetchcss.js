const fetch = require('node-fetch');


process.on('message', (options) => {
	fetch(options.css)
		.then((res) => res.text())
		.then((css) => process.send(css));
});

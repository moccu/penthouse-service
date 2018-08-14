const penthouse = require('penthouse');


process.on('message', (options) => {
	penthouse(options)
		.then((css) => process.send({css}))
		.catch((error) => process.send({error}));
});

const penthouse = require('penthouse');


process.on('message', (options) => {
	penthouse(options)
		.then((critical) => process.send(critical));
});

module.exports.parse = (query, available) => {

	function cast(value, type) {
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

	var options = {};
	Object.keys(available).forEach(key => {
		if (key in query) {
			const option = available[key];
			const value = cast(query[key], option.type);
			options[key] = value;
		}
	});

	return options;
};

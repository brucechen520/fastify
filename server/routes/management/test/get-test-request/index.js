const schema = require('./schema');
const handler = require('./handler');

module.exports = {
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					hello: {
						type: 'string',
					},
				},
			},
		},
	},
	handler,
};

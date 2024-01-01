require('dotenv').config();

const config = require('config');

const {
	sqlLogging,
	mysqlURL,
} = config;

require('../server/lib/sequelize-lib').connect(mysqlURL, {
	logging: true,
})
	.then(() => {
		const fastify = require('fastify')({
			logger: sqlLogging,
			ajv: {
				plugins: [
					[require('ajv-keywords'), ['uniqueItemProperties', 'transform']],
				],
			},
		});

		require('../server/management')(fastify);

		fastify.listen({
			host: '0.0.0.0',
			port: '3030',
		}, (error, address) => {
			if (error) {
				fastify.log.error(error);

				process.exit(1);
			}
		});
	});

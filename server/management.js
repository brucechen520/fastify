module.exports = async function (fastify) {
	// add schema
	require('./lib/ajv/schema')(fastify);

	fastify.register(require('./routes/management/index.v1'), { prefix: '/api/v1/' });

	return fastify;
};

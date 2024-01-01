module.exports = function (fastify) {
	fastify.addSchema(require('./error'));
	fastify.addSchema(require('./test'));
};

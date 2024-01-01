module.exports = function (fastify, options, done) {
	// test
	fastify.get('/test', require('./test/get-test-request'));

	done();
};

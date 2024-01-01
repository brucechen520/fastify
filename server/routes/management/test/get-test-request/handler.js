module.exports = async function (request, reply) {
	return reply.status(200).send({
		hello: 'world',
	});
};

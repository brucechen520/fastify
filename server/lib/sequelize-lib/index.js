const Sequelize = require("sequelize");

async function connect(url, {
	maxPoolSize = 4,
	minPoolSize = 1,
	logging = false,
	timeout = 60000,
	decimalNumbers = true
} = {}) {
	console.log(`connecting ${url}...`);

	if (logging === true) {
		logging = console.log;
	}

	sequelize = new Sequelize(url, {
		logging,
		dialect: "mysql",
		pool: {
			max: maxPoolSize,
			min: minPoolSize,
			acquire: 60000,
			idle: 10000
		},
		timezone: "+08:00",
		benchmark: true,
		define: {
			timestamps: true,
			charset: "utf8",
		},
		query: {
			raw: true,
		},
		dialectOptions: {
			decimalNumbers,
			connectTimeout: timeout,
			maxPreparedStatements: 500,
		},
		retry: {
			match: [
				/ETIMEDOUT/,
				/EHOSTUNREACH/,
				/ECONNRESET/,
				/ECONNREFUSED/,
				/ETIMEDOUT/,
				/ESOCKETTIMEDOUT/,
				/EHOSTUNREACH/,
				/EPIPE/,
				/EAI_AGAIN/,
				/ConnectionError/,
				/SequelizeConnectionError/,
				/SequelizeConnectionRefusedError/,
				/SequelizeHostNotFoundError/,
				/SequelizeHostNotReachableError/,
				/SequelizeInvalidConnectionError/,
				/SequelizeConnectionTimedOutError/,
				/ConnectionAcquireTimeoutError/,
				/SequelizeConnectionAcquireTimeoutError/,
				/Connection terminated unexpectedly/,
			],
			name: 'query',
			backoffBase: 100,
			backoffExponent: 1.1,
			timeout,
			max: Infinity
		},
	});

	try {
		await sequelize.authenticate();
	} catch (error) {
		console.error(error);

		throw error;
	}

	console.log(`connected ${url}`);
}

class Transaction {
	async commit(operations) {
		const transaction = await sequelize.transaction();

		try {
			const result = await operations(transaction);

			await transaction.commit();

			return result;
		} catch (error) {
			if (transaction.finished !== "rollback") {
				await transaction.rollback();
			}

			throw error;
		}
	}
}

module.exports = {
	connect,
	Transaction,
};

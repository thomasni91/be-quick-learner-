process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
	api: {
		prefix: process.env.API_PREFIX || '/api/v1',
	},
};

import swaggerJsDoc from 'swagger-jsdoc';

export default swaggerJsDoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Quick Learner',
			version: '1.0.0',
			contact: {
				name: 'Quick Learner',
				email: 'example.com',
			},
			description: 'API docs for Quick Learner',
		},
		servers: [
			{
				url: process.env.NODE_ENV === 'development' ? process.env.SWAGGERURL_DEV : process.env.SWAGGERURL_PRD,
			},
		],
	},

	apis: ['app/controllers/*.js', 'app/models/*.js'],
});

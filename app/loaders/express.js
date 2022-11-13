import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import config from '../config/app';
import apiRouter from '../routes/v1/api';
import swaggerJsDoc from '../utils/swagger';
import logger from '../utils/logger';

export default (app) => {
	app.use(express.json());
	app.use(morgan('dev'));
	app.use(cors());
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
	app.use(config.api.prefix, apiRouter);
	app.get('/', (req, res) => {
		res.json({ hello: 'World.b' });
		logger.info('Server Sent A Hello World!');
	});
	return app;
};

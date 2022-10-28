// getting-started.js
import mongoose from 'mongoose';
import logger from '../utils/logger';

let options = {};
if (process.env.NODE_ENV !== 'development') {
	options = { ...options, autoIndex: false };
}

async function main() {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}
			@cluster0.vtkqb.mongodb.net/quickLearner?retryWrites=true&w=majority`,
			options,
		);
		logger.info(`Database <quickLearner> connected`);
	} catch (error) {
		logger.error(`Database error: ${error}`);
	}
}

main();

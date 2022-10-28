import serverless from 'serverless-http';
import 'dotenv/config';
import express from 'express';
import init from './loaders';

const app = express();

init(app);

export default app;
export const handler = serverless(app);

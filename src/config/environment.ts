import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

// app credentials
export const APP_PORT = process.env.APP_PORT;
export const APP_NAME = process.env.APP_NAME;

// redis credentials
export const REDIS_PORT_NUMBER = process.env.REDIS_PORT_NUMBER;

// db connection credentials
export const MONGODB_URL = process.env.MONGODB_URL;

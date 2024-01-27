import { config } from 'dotenv';
import * as process from 'process';

config();

//Application
export const appPort = process.env.APP_PORT;

// Database
export const host = process.env.DB_HOST || 'localhost';
export const port = parseInt(process.env.DB_PORT);
export const user = process.env.DB_USER || 'postgres';
export const password = process.env.DB_PASS.toString() || 'ashish';
export const database = process.env.DB_NAME;
export const synchronize = false;
export const logging = true;

//Swagger Documentation
export const swaggerTitle = process.env.API_TITLE;
export const swaggerDescription = process.env.API_DESCRIPTION;
export const swaggerVersion = process.env.API_VERSION;
export const swaggerDocs = process.env.API_DOCS;

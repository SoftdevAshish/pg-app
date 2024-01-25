import { config } from 'dotenv';
import * as process from 'process';

config();

export const appPort = process.env.APP_PORT;

//Swagger Documentation
export const swaggerTitle = process.env.API_TITLE;
export const swaggerDescription = process.env.API_DESCRIPTION;
export const swaggerVersion = process.env.API_VERSION;
export const swaggerDocs = process.env.API_DOCS;

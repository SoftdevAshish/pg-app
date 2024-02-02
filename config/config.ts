import { config } from 'dotenv';
import * as process from 'process';

config();

//Application
export const appPort = process.env.APP_PORT;

// Database
export const host = process.env.DB_HOST;
export const port = parseInt(process.env.DB_PORT);
export const user = process.env.DB_USER;
export const password = process.env.DB_PASS.toString();
export const database = process.env.DB_NAME;
export const synchronize = false;
export const logging = true;

//Swagger Documentation
export const swaggerTitle = process.env.API_TITLE;
export const swaggerDescription = process.env.API_DESCRIPTION;
export const swaggerVersion = process.env.API_VERSION;
export const swaggerDocs = process.env.API_DOCS;

// Mail Details
export const emailHost = process.env.MAIL_HOST;
export const emailPort = parseInt(process.env.MAIL_PORT);
export const emailSecure = process.env.MAIL_SECURE === 'true';
export const emailUsername = process.env.MAIL_USERNAME;
export const emailPassword = process.env.MAIL_PASSWORD;
export const tempDir = process.env.MAIL_TEMPLATE_DIR;
export const tempExt = process.env.MAIL_TEMPLATE_EXTENSION;

// JWT Tokens
export const access_strategy = process.env.STRATEGY_ACCESS;
export const refresh_strategy = process.env.STRATEGY_REFRESH;
export const access_secret_key = process.env.ACCESS_SECRET_KEY;
export const access_secret_key_expire_time =
  process.env.ACCESS_SECRET_KEY_EXPIRE_TIME;
export const refresh_secret_key = process.env.REFRESH_SECRET_KEY;
export const refresh_secret_key_expire_time =
  process.env.REFRESH_SECRET_KEY_EXPIRE_TIME;

export const metaKey = process.env.META_KEY;
export const firstLogin = process.env.FIRST_LOGIN;

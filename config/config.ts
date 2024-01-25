import { config } from 'dotenv';
import * as process from 'process';

config();

export const appPort = process.env.APP_PORT;

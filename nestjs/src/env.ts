import { config } from 'dotenv';
import populateEnv from 'populate-env';

config();

export let env = {
  NODE_ENV: 'development',
  JWT_SECRET: 'my-secret',
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  DB_HOST: '',
  DB_PORT: 5432,
  WEB_PORT: 8200,
  EMAIL_ADDRESS: '',
  EMAIL_PASSWORD: '',
  APP_NAME: 'Trip Mingle',
};

populateEnv(env, { mode: 'halt' });

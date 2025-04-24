import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const envFile = path.dirname(__filename);

dotenv.config({ path: envFile });

export default {
  env: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
};

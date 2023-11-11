import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Development mode', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});

process.env.NODE_ENV = program.opts().mode;

export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    PERSISTENCE: process.env.PERSISTENCE,
    DB_PASSWORD: process.env.DB_PASSWORD,
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
}
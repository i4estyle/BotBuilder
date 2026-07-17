import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables from the root .env file

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [
    path.resolve(process.cwd(), 'dist/**/*.entity.js'),
  ],
  migrations: [
    path.resolve(process.cwd(), 'dist/database/migrations/*.js'),
  ],
  subscribers: [],
});

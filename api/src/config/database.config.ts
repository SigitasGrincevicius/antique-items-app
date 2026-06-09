import { registerAs } from '@nestjs/config';
import type { DatabaseConfig } from './config.types';

export const typeOrmConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'antique-items',
  }),
);

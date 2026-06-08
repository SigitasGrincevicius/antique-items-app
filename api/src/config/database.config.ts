import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  databaseUser: string;
}

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    databaseUser: process.env.DATABASE_USER ?? 'postgres',
  }),
);

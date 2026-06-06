import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  databaseUser: process.env.DATABASE_USER ?? 'test',
}));

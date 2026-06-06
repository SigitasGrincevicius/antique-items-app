import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
  databaseUser: process.env.DATABASE_USER ?? 'test',
}));

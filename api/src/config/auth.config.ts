import { registerAs } from '@nestjs/config';
import type { AuthConfig } from './config.types';

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: parseInt(process.env.EXPIRES_IN ?? '600', 10),
  }),
);

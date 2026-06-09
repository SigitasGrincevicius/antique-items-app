import { registerAs } from '@nestjs/config';
import type { AppConfig } from './config.types';

export const appConfig = registerAs(
   'app',
   (): AppConfig => ({
      port: Number(process.env.APP_PORT ?? '3000'),
   }),
);

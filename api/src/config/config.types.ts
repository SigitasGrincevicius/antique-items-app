import * as Joi from 'joi';

export interface AppConfig {
  port: number;
}

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface AuthConfig {
  secret: string;
  expiresIn: number;
}

export interface ConfigType {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
}

export const appConfigSchema = Joi.object({
  APP_PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNC: Joi.number().valid(0, 1).required(),
  JWT_SECRET: Joi.string().required(),
  EXPIRES_IN: Joi.number().integer().positive().default(600),
});

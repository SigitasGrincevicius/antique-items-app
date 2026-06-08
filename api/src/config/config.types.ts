import { DatabaseConfig } from './database.config';
import * as Joi from 'joi';

export interface ConfigType {
  database: DatabaseConfig;
}

export const databaseConfigSchema = Joi.object({
  DATABASE_USER: Joi.string().default('postgres')
})

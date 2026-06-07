import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/config.types';
import { DatabaseConfig } from './config/database.config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<ConfigType>) {}

  getHello(): string {
    const user =
      this.configService.get<DatabaseConfig>('database')?.databaseUser;

    console.log('User', user);
    return 'I find your lack of faith disturbing';
  }
}

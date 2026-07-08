import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType, DatabaseConfig } from './config/config.types';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<ConfigType>) {}

  getHello(): string {
    const user =
      this.configService.getOrThrow<DatabaseConfig>('database').username;

    return 'I find your lack of faith disturbing';
  }
}

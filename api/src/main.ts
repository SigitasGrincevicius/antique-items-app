import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig, ConfigType } from './config/config.types';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<ConfigType>>(ConfigService);

  configureApp(app);

  await app.listen(configService.getOrThrow<AppConfig>('app').port);
}
bootstrap().catch((error) => {
  console.error('Failed to start application', error);
  process.exit(1);
});

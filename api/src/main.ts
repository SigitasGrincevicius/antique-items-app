import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig, ConfigType } from './config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<ConfigType>>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(configService.getOrThrow<AppConfig>('app').port);
}
bootstrap().catch((error) => {
  console.error('Failed to start application', error);
  process.exit(1);
});

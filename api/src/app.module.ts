import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiqueItemsModule } from './antique-items/antique-items.module';
import { appConfig } from './config/app.config';
import { typeOrmConfig } from './config/database.config';
import { appConfigSchema, DatabaseConfig } from './config/config.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnkwon: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<DatabaseConfig>('database'),
    }),
    AntiqueItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiqueItemsModule } from './antique-items/antique-items.module';
import { appConfig } from './config/app.config';
import { typeOrmConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import {
  appConfigSchema,
  ConfigType,
  DatabaseConfig,
} from './config/config.types';
import { AntiqueItem } from './antique-items/antique-item.entity';
import { User } from './users/user.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnkwon: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        ...configService.getOrThrow<DatabaseConfig>('database'),
        entities: [AntiqueItem, User, Category],
      }),
    }),
    AntiqueItemsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

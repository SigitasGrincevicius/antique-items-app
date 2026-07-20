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
import { AntiqueItem } from './antique-items/entities/antique-item.entity';
import { User } from './users/entities/user.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiqueItemsModule } from './antique-items/antique-items.module';
import { databaseConfig } from './config/database.config';
import { databaseConfigSchema } from './config/config.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      validationSchema: databaseConfigSchema,
      validationOptions: {
        // allowUnkwon: false,
        abortEarly: true
      },
    }),
    AntiqueItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

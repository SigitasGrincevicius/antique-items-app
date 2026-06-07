import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiqueItemsModule } from './antique-items/antique-items.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      load: [databaseConfig],
    }),
    AntiqueItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

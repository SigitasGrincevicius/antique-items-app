import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiqueItemsModule } from './antique-items/antique-items.module';

@Module({
  imports: [AntiqueItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

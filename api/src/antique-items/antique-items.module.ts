import { Module } from '@nestjs/common';
import { AntiqueItemsController } from './antique-items.controller';
import { AntiqueItemsService } from './antique-items.service';

@Module({
  controllers: [AntiqueItemsController],
  providers: [AntiqueItemsService]
})
export class AntiqueItemsModule {}

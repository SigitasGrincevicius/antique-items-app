import { Module } from '@nestjs/common';
import { AntiqueItemsController } from './antique-items.controller';

@Module({
  controllers: [AntiqueItemsController]
})
export class AntiqueItemsModule {}

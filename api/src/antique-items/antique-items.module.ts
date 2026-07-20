import { Module } from '@nestjs/common';
import { AntiqueItemsController } from './antique-items.controller';
import { AntiqueItemsService } from './antique-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntiqueItem } from './entities/antique-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AntiqueItem])],
  controllers: [AntiqueItemsController],
  providers: [AntiqueItemsService],
})
export class AntiqueItemsModule {}

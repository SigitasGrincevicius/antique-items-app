import { Controller, Get, Param } from '@nestjs/common';
import { AntiqueItemsService } from './antique-items.service';
import { IAntiqueItem } from './antique-item.model';

@Controller('antique-items')
export class AntiqueItemsController {
  constructor(private readonly antiqueItemsService: AntiqueItemsService) {}

  @Get()
  public findAll(): IAntiqueItem[] {
    return this.antiqueItemsService.findAll();
  }

  @Get('/:id')
  public findOne(@Param('id') id: string): IAntiqueItem | undefined {
    return this.antiqueItemsService.findOne(id);
  }
}

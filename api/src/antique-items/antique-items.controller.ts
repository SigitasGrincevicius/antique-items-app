import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AntiqueItemsService } from './antique-items.service';
import type { IAntiqueItem } from './antique-item.model';
import { CreateAntiqueItemDto } from './create-antique-item.dto';

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

  @Post()
  public create(
    @Body() createAntiqueItemDto: CreateAntiqueItemDto,
  ): IAntiqueItem {
    return this.antiqueItemsService.create(createAntiqueItemDto);
  }
}

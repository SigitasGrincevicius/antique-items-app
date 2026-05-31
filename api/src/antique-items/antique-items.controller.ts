import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AntiqueItemsService } from './antique-items.service';
import type { IAntiqueItem } from './antique-item.model';
import { CreateAntiqueItemDto } from './create-antique-item.dto';
import { FindOneParams } from './find-one.params';

@Controller('antique-items')
export class AntiqueItemsController {
  constructor(private readonly antiqueItemsService: AntiqueItemsService) {}

  @Get()
  public findAll(): IAntiqueItem[] {
    return this.antiqueItemsService.findAll();
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): IAntiqueItem {
    return this.antiqueItemsService.findOne(params.id);
  }

  @Post()
  public create(
    @Body() createAntiqueItemDto: CreateAntiqueItemDto,
  ): IAntiqueItem {
    return this.antiqueItemsService.create(createAntiqueItemDto);
  }
}

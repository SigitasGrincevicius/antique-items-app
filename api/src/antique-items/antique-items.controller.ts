import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AntiqueItemsService } from './antique-items.service';
import { CreateAntiqueItemDto } from './create-antique-item.dto';
import { FindOneParams } from './find-one.params';
import { UpdateAntiqueItemDto } from './update-antique-item.dto';
import { AntiqueItem } from './antique-item.entity';
import { FindAntiqueItemParams } from './find-antique-item.params';
import { PaginationResponse } from '../common/pagination.response';

@Controller('antique-items')
export class AntiqueItemsController {
  constructor(private readonly antiqueItemsService: AntiqueItemsService) {}

  @Get()
  public async findAll(
    @Query() query: FindAntiqueItemParams,
  ): Promise<PaginationResponse<AntiqueItem>> {
    const [items, total] = await this.antiqueItemsService.findAll(query, query);

    return {
      data: items,
      meta: {
        total,
        offset: query.offset,
        limit: query.limit,
      },
    };
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): Promise<AntiqueItem> {
    return this.antiqueItemsService.findOne(params.id);
  }

  @Post()
  public create(
    @Body() createAntiqueItemDto: CreateAntiqueItemDto,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsService.create(createAntiqueItemDto);
  }

  @Patch('/:id')
  public update(
    @Param() params: FindOneParams,
    @Body() updateAntiqueItemDto: UpdateAntiqueItemDto,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsService.update(params.id, updateAntiqueItemDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param() params: FindOneParams): Promise<void> {
    return this.antiqueItemsService.delete(params.id);
  }
}

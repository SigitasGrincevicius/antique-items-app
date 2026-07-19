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
import { CurrentUserId } from '../users/decorators/current-user-id.decorator';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { AuthUser } from '../users/auth.request';

@Controller('antique-items')
export class AntiqueItemsController {
  constructor(private readonly antiqueItemsService: AntiqueItemsService) {}

  @Get()
  public async findAll(
    @Query() query: FindAntiqueItemParams,
  ): Promise<PaginationResponse<AntiqueItem>> {
    const [items, total] = await this.antiqueItemsService.findAll(query, query);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: items,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
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
    @CurrentUserId() userId: string,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsService.create(createAntiqueItemDto, userId);
  }

  @Patch('/:id')
  public update(
    @Param() params: FindOneParams,
    @Body() updateAntiqueItemDto: UpdateAntiqueItemDto,
    @CurrentUser() user: AuthUser,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsService.update(
      params.id,
      updateAntiqueItemDto,
      user,
    );
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(
    @Param() params: FindOneParams,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    return this.antiqueItemsService.delete(params.id, user);
  }
}

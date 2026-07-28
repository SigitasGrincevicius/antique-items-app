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
import { CreateAntiqueItemDto } from './dto/create-antique-item.dto';
import { FindOneParams } from '../common/params/id.params';
import { UpdateAntiqueItemDto } from './dto/update-antique-item.dto';
import { AntiqueItem } from './entities/antique-item.entity';
import { FindAntiqueItemParams } from './params/find-antique-item.params';
import { PaginationResponse } from '../common/pagination/pagination.response';
import { CurrentUserId } from '../users/auth/decorators/current-user-id.decorator';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';
import type { AuthUser } from '../users/auth/interfaces/auth-request.interface';

@Controller('antique-items')
export class AntiqueItemsController {
  constructor(private readonly antiqueItemsService: AntiqueItemsService) {}

  // Read
  @Get('/favorites')
  public findFavorites(
    @CurrentUserId() userId: string,
  ): Promise<AntiqueItem[]> {
    return this.antiqueItemsService.findFavorites(userId);
  }

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

  // Create / update
  @Post()
  public create(
    @Body() createAntiqueItemDto: CreateAntiqueItemDto,
    @CurrentUserId() userId: string,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsService.create(createAntiqueItemDto, userId);
  }

  @Post('/:id/favorite')
  public addFavorite(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    return this.antiqueItemsService.addFavorite(params.id, userId);
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

  // Delete
  @Delete('/:id/favorite')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeFavorite(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    return this.antiqueItemsService.removeFavorite(params.id, userId);
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

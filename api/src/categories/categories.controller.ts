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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { FindOneParams } from '../antique-items/find-one.params';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  public findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): Promise<Category> {
    return this.categoriesService.findOne(params.id);
  }

  @Post()
  public create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('/:id')
  public update(
    @Param() params: FindOneParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(params.id, updateCategoryDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param() params: FindOneParams): Promise<void> {
    return this.categoriesService.delete(params.id);
  }
}

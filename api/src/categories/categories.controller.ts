import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { FindOneParams } from '../antique-items/find-one.params';
import { CreateCategoryDto } from './create-category.dto';

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
   @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
   return this.categoriesService.create(createCategoryDto);
  }
}

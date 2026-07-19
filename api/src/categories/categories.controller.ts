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
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/role.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(Role.ADMIN)
  public findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('/:id')
  @Roles(Role.ADMIN)
  public findOne(@Param() params: FindOneParams): Promise<Category> {
    return this.categoriesService.findOne(params.id);
  }

  @Post()
  @Roles(Role.ADMIN)
  public create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  public update(
    @Param() params: FindOneParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(params.id, updateCategoryDto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param() params: FindOneParams): Promise<void> {
    return this.categoriesService.delete(params.id);
  }
}

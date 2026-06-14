import { Module, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateAntiqueItemDto } from '../antique-items/update-antique-item.dto';

@Module({})
export class CategoriesModule {
  constructor(private readonly categoriesRepository: Repository<Category>) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(id: string): Promise<Category> {
    return this.findOneOrFail(id);
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.save(dto);
  }

  async update(id: string, dto: UpdateAntiqueItemDto): Promise<Category> {
    const category = await this.findOneOrFail(id);
    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findOneOrFail(id);
    await this.categoriesRepository.delete(category.id);
  }

  private async findOneOrFail(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (category) return category;

    throw new NotFoundException();
  }
}

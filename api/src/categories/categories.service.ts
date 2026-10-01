import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { AntiqueItem } from '../antique-items/entities/antique-item.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(AntiqueItem)
    private readonly antiqueItemsRepository: Repository<AntiqueItem>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(id: string): Promise<Category> {
    return this.findOneOrFail(id);
  }

  public async create(dto: CreateCategoryDto): Promise<Category> {
    await this.ensureNameIsAvailable(dto.name);

    return this.categoriesRepository.save(dto);
  }

  public async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOneOrFail(id);

    if (dto.name !== category.name) {
      await this.ensureNameIsAvailable(dto.name);
    }

    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  public async delete(id: string): Promise<void> {
    const category = await this.findOneOrFail(id);

    const hasItems = await this.antiqueItemsRepository.existsBy({
      categoryId: category.id,
    });

    if (hasItems) {
      throw new ConflictException(
        `Category "${category.name}" still contains antique items`,
      );
    }

    await this.categoriesRepository.delete(category.id);
  }

  private async ensureNameIsAvailable(name: string): Promise<void> {
    const nameTaken = await this.categoriesRepository.existsBy({ name });

    if (nameTaken) {
      throw new ConflictException(`Category with name "${name}" already exists`);
    }
  }

  private async findOneOrFail(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (category) return category;

    throw new NotFoundException();
  }
}

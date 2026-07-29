import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAntiqueItemDto } from './dto/create-antique-item.dto';
import type { UpdateAntiqueItemDto } from './dto/update-antique-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AntiqueItem } from './entities/antique-item.entity';
import { Repository } from 'typeorm';
import { FindAntiqueItemParams } from './params/find-antique-item.params';
import { PaginationParams } from '../common/pagination/pagination.params';
import { Role } from '../users/auth/role.enum';
import type { AuthUser } from '../users/auth/interfaces/auth-request.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AntiqueItemsService {
  constructor(
    @InjectRepository(AntiqueItem)
    private readonly antiqueItemsRepository: Repository<AntiqueItem>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public findAll(
    filters: FindAntiqueItemParams,
    pagination: PaginationParams,
  ): Promise<[AntiqueItem[], number]> {
    const query = this.antiqueItemsRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category');

    if (filters.categoryId) {
      query.andWhere('item.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.search?.trim()) {
      query.andWhere(
        '(item.name ILIKE :search OR item.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.categories?.length) {
      query.andWhere('category.name IN (:...names)', {
        names: filters.categories,
      });
    }

    const sortColumns = {
      name: 'item.name',
      createdAt: 'item.createdAt',
      updatedAt: 'item.updatedAt',
      category: 'category.name',
    } as const;

    const orderColumn =
      sortColumns[filters.sortBy as keyof typeof sortColumns] ??
      sortColumns.createdAt;

    query.orderBy(orderColumn, filters.sortOrder);
    query.skip(pagination.offset).take(pagination.limit);

    return query.getManyAndCount();
  }

  public findOne(id: string): Promise<AntiqueItem> {
    return this.findOneOrFail(id);
  }

  public async create(
    createAntiqueItemDto: CreateAntiqueItemDto,
    userId: string,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsRepository.save({
      ...createAntiqueItemDto,
      createdById: userId,
    });
  }

  public async update(
    id: string,
    updateAntiqueItemDto: UpdateAntiqueItemDto,
    user: AuthUser,
  ): Promise<AntiqueItem> {
    const antiqueItem = await this.findOneOrFail(id);
    this.checkItemOwnership(antiqueItem, user);

    Object.assign(antiqueItem, updateAntiqueItemDto);
    return this.antiqueItemsRepository.save(antiqueItem);
  }

  public async delete(id: string, user: AuthUser): Promise<void> {
    const antiqueItem = await this.findOneOrFail(id);
    this.checkItemOwnership(antiqueItem, user);

    await this.antiqueItemsRepository.delete(antiqueItem.id);
  }

  private async findOneOrFail(id: string): Promise<AntiqueItem> {
    const item = await this.antiqueItemsRepository.findOne({
      where: { id },
      relations: { createdBy: true, category: true },
    });

    if (item) {
      return item;
    }

    throw new NotFoundException();
  }

  public async findFavorites(userId: string): Promise<AntiqueItem[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        favoritedItems: {
          category: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user.favoritedItems;
  }

  public async addFavorite(itemId: string, userId: string): Promise<void> {
    await this.findOneOrFail(itemId);

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { favoritedItems: true },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const isAlreadyFavorite = user.favoritedItems.some(
      (favoriteItem) => favoriteItem.id === itemId,
    );

    if (isAlreadyFavorite) {
      throw new ConflictException('This item is already in your favorites');
    }

    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'favoritedItems')
      .of(userId)
      .add(itemId);
  }

  public async removeFavorite(itemId: string, userId: string): Promise<void> {
    await this.findOneOrFail(itemId);

    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'favoritedItems')
      .of(userId)
      .remove(itemId);
  }

  private checkItemOwnership(antiqueItem: AntiqueItem, user: AuthUser): void {
    const isOwner = antiqueItem.createdById === user.sub;
    const isAdmin = user.roles.includes(Role.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can not modify this antique item');
    }
  }
}

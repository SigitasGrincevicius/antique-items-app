import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAntiqueItemDto } from './create-antique-item.dto';
import type { UpdateAntiqueItemDto } from './update-antique-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AntiqueItem } from './antique-item.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FindAntiqueItemParams } from './find-antique-item.params';
import { PaginationParams } from '../common/pagination.params';

@Injectable()
export class AntiqueItemsService {
  constructor(
    @InjectRepository(AntiqueItem)
    private readonly antiqueItemsRepository: Repository<AntiqueItem>,
  ) {}

  public async findAll(
    filters: FindAntiqueItemParams,
    pagination: PaginationParams,
  ): Promise<[AntiqueItem[], number]> {
    const baseWhere: FindOptionsWhere<AntiqueItem> = {};

    if (filters.categoryId) {
      baseWhere.categoryId = filters.categoryId;
    }

    const where: FindOptionsWhere<AntiqueItem> | FindOptionsWhere<AntiqueItem>[] =
      filters.search?.trim()
        ? [
            { ...baseWhere, name: ILike(`%${filters.search}%`) },
            { ...baseWhere, description: ILike(`%${filters.search}%`) },
          ]
        : baseWhere;

    return await this.antiqueItemsRepository.findAndCount({
      where,
      relations: { createdBy: true, category: true },
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  public findOne(id: string): Promise<AntiqueItem> {
    return this.findOneOrFail(id);
  }

  public async create(
    createAntiqueItemDto: CreateAntiqueItemDto,
  ): Promise<AntiqueItem> {
    return this.antiqueItemsRepository.save(createAntiqueItemDto);
  }

  public async update(
    id: string,
    updateAntiqueItemDto: UpdateAntiqueItemDto,
  ): Promise<AntiqueItem> {
    const antiqueItem = await this.findOneOrFail(id);

    Object.assign(antiqueItem, updateAntiqueItemDto);
    return this.antiqueItemsRepository.save(antiqueItem);
  }

  public async delete(id: string): Promise<void> {
    const antiqueItem = await this.findOneOrFail(id);

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
}

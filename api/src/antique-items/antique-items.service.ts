import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAntiqueItemDto } from './create-antique-item.dto';
import type { UpdateAntiqueItemDto } from './update-antique-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AntiqueItem } from './antique-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AntiqueItemsService {
  constructor(
    @InjectRepository(AntiqueItem)
    private readonly antiqueItemsRepository: Repository<AntiqueItem>,
  ) {}

  public findAll(): Promise<AntiqueItem[]> {
    return this.antiqueItemsRepository.find({
      relations: { createdBy: true, category: true },
    });
  }

  public findOne(id: string): Promise<AntiqueItem> {
    return this.findOneOrFail(id)
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

    await this.antiqueItemsRepository.delete(antiqueItem.id)
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

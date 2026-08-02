import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AntiqueItemsService } from './antique-items.service';
import { AntiqueItem } from './entities/antique-item.entity';
import { User } from '../users/entities/user.entity';
import { FindAntiqueItemParams } from './params/find-antique-item.params';
import { PaginationParams } from '../common/pagination/pagination.params';
import { AuthUser } from '../users/auth/interfaces/auth-request.interface';
import { NotFoundException } from '@nestjs/common';
import { CreateAntiqueItemDto } from './dto/create-antique-item.dto';

describe('AntiqueItemsService', () => {
  let service: AntiqueItemsService;

  const queryBuilderMock = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const favoriteRelationMock = {
    of: jest.fn().mockReturnThis(),
    add: jest.fn(),
    remove: jest.fn(),
  };

  const antiqueItemsRepositoryMock = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const usersRepositoryMock = {
    finOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      relation: jest.fn().mockReturnValue(favoriteRelationMock),
    }),
  };

  const item = {
    id: 'item-1',
    name: 'Pocket watch',
    createdById: 'owner-1',
  } as AntiqueItem;

  const owner = {
    sub: 'owner-1',
    name: 'Luke Skywalker',
    roles: [],
  } as AuthUser;

  const nonOwner = {
    sub: 'owner-2',
    name: 'Ahsoka Tano',
    roles: [],
  } as AuthUser;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiqueItemsService,
        {
          provide: getRepositoryToken(AntiqueItem),
          useValue: antiqueItemsRepositoryMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AntiqueItemsService>(AntiqueItemsService);
  });

  describe('findAll', () => {
    it('filters by category and returns the paginated items', async () => {
      const items = [item];
      const filters = new FindAntiqueItemParams();
      filters.categoryId = 'category-1';
      filters.sortBy = 'name';
      filters.sortOrder = 'ASC';

      const pagination = new PaginationParams();
      pagination.page = 2;
      pagination.limit = 5;

      queryBuilderMock.getManyAndCount.mockResolvedValue([items, 1]);

      await expect(service.findAll(filters, pagination)).resolves.toEqual([
        items,
        1,
      ]);

      expect(
        antiqueItemsRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalledWith('item');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'item.categoryId = :categoryId',
        { categoryId: 'category-1' },
      );
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('item.name', 'ASC');
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(5);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(5);
    });
  });

  describe('findOne', () => {
    it('returns an item when it exists', async () => {
      antiqueItemsRepositoryMock.findOne.mockResolvedValue(item);

      await expect(service.findOne(item.id)).resolves.toEqual(item);

      expect(antiqueItemsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: item.id },
        relations: { createdBy: true, category: true },
      });
    });

    it('throws NotFoundException when the item does not exist', async () => {
      antiqueItemsRepositoryMock.findOne.mockResolvedValue(null);

      const promise = service.findOne('missing-id');

      await expect(promise).rejects.toBeInstanceOf(NotFoundException);
      await expect(promise).rejects.toThrow(
        'Antique item missing-id was not found',
      );
    });
  });

  describe('create', () => {
    it('saves the item DTO with the creating user ID', async () => {
      const dto = {
        name: 'Pocket watch',
        year: 1901,
        priceEur: 900,
        categoryId: 'category-1',
      } as CreateAntiqueItemDto;

      const savedItem = {
        ...dto,
        id: 'item-1',
        createdById: owner.sub,
      } as AntiqueItem;

      antiqueItemsRepositoryMock.save.mockResolvedValue(savedItem);

      await expect(service.create(dto, owner.sub)).resolves.toEqual(savedItem);

      expect(antiqueItemsRepositoryMock.save).toHaveBeenCalledWith({
        ...dto,
        createdById: owner.sub,
      });
    });
  });
});

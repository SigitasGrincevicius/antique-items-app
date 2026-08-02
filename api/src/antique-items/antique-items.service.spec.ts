import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AntiqueItemsService } from './antique-items.service';
import { AntiqueItem } from './entities/antique-item.entity';
import { User } from '../users/entities/user.entity';
import { FindAntiqueItemParams } from './params/find-antique-item.params';
import { PaginationParams } from '../common/pagination/pagination.params';
import { AuthUser } from '../users/auth/interfaces/auth-request.interface';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateAntiqueItemDto } from './dto/create-antique-item.dto';
import { Role } from '../users/auth/role.enum';

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

  describe('update', () => {
    it('updates an item when the user is its owner', async () => {
      const dto = { name: 'Restored pocket watch' };
      const updatedItem = { ...item, ...dto };

      antiqueItemsRepositoryMock.findOne.mockResolvedValue({ ...item });
      antiqueItemsRepositoryMock.save.mockResolvedValue(updatedItem);

      await expect(service.update(item.id, dto, owner)).resolves.toEqual(
        updatedItem,
      );

      expect(antiqueItemsRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
    });

    it('updates an item when the user is an admin', async () => {
      const admin = { ...nonOwner, roles: [Role.ADMIN] };
      const dto = { name: 'Admin updated item' };

      antiqueItemsRepositoryMock.findOne.mockResolvedValue({ ...item });
      antiqueItemsRepositoryMock.save.mockResolvedValue({ ...item, ...dto });

      await expect(service.update(item.id, dto, admin)).resolves.toEqual({
        ...item,
        ...dto,
      });
    });

    it('throws ForbiddenException when a non-owner tries to update', async () => {
      antiqueItemsRepositoryMock.findOne.mockResolvedValue(item);

      await expect(
        service.update(item.id, { name: 'Not allowed' }, nonOwner),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(antiqueItemsRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes an item when the user is its owner', async () => {
      antiqueItemsRepositoryMock.findOne.mockResolvedValue(item);
      antiqueItemsRepositoryMock.delete.mockResolvedValue({ affected: 1 });

      await expect(service.delete(item.id, owner)).resolves.toBeUndefined();

      expect(antiqueItemsRepositoryMock.delete).toHaveBeenCalledWith(item.id);
    });

    it('throws ForbiddenException when a non-owner tries to delete', async () => {
      antiqueItemsRepositoryMock.findOne.mockResolvedValue(item);

      await expect(service.delete(item.id, nonOwner)).rejects.toBeInstanceOf(
        ForbiddenException,
      );

      expect(antiqueItemsRepositoryMock.delete).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when the deletion affects no item', async () => {
      antiqueItemsRepositoryMock.findOne.mockResolvedValue(item);
      antiqueItemsRepositoryMock.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(item.id, owner)).rejects.toBeInstanceOf(
        `Antique item ${item.id} was not found`,
      );
    });
  });
});

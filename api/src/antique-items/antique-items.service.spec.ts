import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AntiqueItemsService } from './antique-items.service';
import { AntiqueItem } from './entities/antique-item.entity';
import { User } from '../users/entities/user.entity';
import { FindAntiqueItemParams } from './params/find-antique-item.params';
import { PaginationParams } from '../common/pagination/pagination.params';

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

  const antiqueItemsRepositoryMock = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
  };

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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AntiqueItemsService>(AntiqueItemsService);
  });

  it('filters by category and returns the paginated items', async () => {
    const items = [{ id: 'item-1', name: 'Pocket watch' }] as AntiqueItem[];
    const filters = new FindAntiqueItemParams();
    filters.categoryId = 'category-1';
    filters.sortBy = 'name';
    filters.sortOrder = 'ASC';

    const pagination = new PaginationParams();
    pagination.page = 2;
    pagination.limit = 5;

    queryBuilderMock.getManyAndCount.mockResolvedValue([items, 1]);

    await expect(
      service.findAll(filters, pagination),
    ).resolves.toEqual([items, 1]);

    expect(antiqueItemsRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
      'item',
    );
    expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
      'item.categoryId = :categoryId',
      { categoryId: 'category-1' },
    );
    expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('item.name', 'ASC');
    expect(queryBuilderMock.skip).toHaveBeenCalledWith(5);
    expect(queryBuilderMock.take).toHaveBeenCalledWith(5);
  });
});

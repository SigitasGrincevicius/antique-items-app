import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const categoriesRepositoryMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const category = {
    id: 'category-1',
    name: 'Clocks',
    createdAt: new Date(),
    updatedAt: new Date(),
    antiqueItems: [],
  } satisfies Category;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoriesRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('findAll', () => {
    it('returns all categories', async () => {
      const categories = [
        category,
        {
          ...category,
          id: 'category-2',
          name: 'Jewellery',
        },
      ];

      categoriesRepositoryMock.find.mockResolvedValue(categories);

      await expect(service.findAll()).resolves.toEqual(categories);

      expect(categoriesRepositoryMock.find).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('returns an existing category', async () => {
      categoriesRepositoryMock.findOneBy.mockResolvedValue(category);

      await expect(service.findOne(category.id)).resolves.toEqual(category);

      expect(categoriesRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: category.id,
      });
    });

    it('throws NtFoundException when the category does not exist', async () => {
      categoriesRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('missing-category')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('saves and returns the new category', async () => {
      const dto = {
        name: 'Clocks',
      } satisfies CreateCategoryDto;

      categoriesRepositoryMock.save.mockResolvedValue(category);

      await expect(service.create(dto)).resolves.toEqual(category);

      expect(categoriesRepositoryMock.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updates and saves an existing category', async () => {
      const existingCategory = {
        ...category,
      };

      const dto = {
        name: 'Antique clocks',
      } satisfies UpdateCategoryDto;

      const updatedCategory = {
        ...existingCategory,
        ...dto,
      };

      categoriesRepositoryMock.findOneBy.mockResolvedValue(existingCategory);
      categoriesRepositoryMock.save.mockResolvedValue(updatedCategory);

      await expect(service.update(category.id, dto)).resolves.toEqual(
        updatedCategory,
      );

      expect(categoriesRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: category.id,
      });
      expect(categoriesRepositoryMock.save).toHaveBeenCalledWith(
        updatedCategory,
      );
    });

    it('throws NotFoundException and does nto save when absent', async () => {
      const dto = {
        name: 'Antique clocks',
      } satisfies UpdateCategoryDto;

      categoriesRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        service.update('missing-category', dto),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(categoriesRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes an existing category by ID', async () => {
      categoriesRepositoryMock.findOneBy.mockResolvedValue(category);
      categoriesRepositoryMock.delete.mockResolvedValue({
        affected: 1,
        raw: [],
      });

      await expect(service.delete(category.id)).resolves.toBeUndefined();

      expect(categoriesRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: category.id,
      });
      expect(categoriesRepositoryMock.delete).toHaveBeenCalledWith(category.id);
    });

    it('throws NotFoundException and does not delete when absent', async () => {
      categoriesRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(service.delete('missing-category')).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(categoriesRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});

// filepath: src/categories/categories.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockPrisma = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [
        { id: 1, nameFr: 'Soins de peau', nameEn: 'Skincare', nameAr: 'العناية بالبشرة' },
        { id: 2, nameFr: 'Maquillage', nameEn: 'Makeup', nameAr: 'المكياج' },
      ];
      mockPrisma.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(mockPrisma.category.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category = { id: 1, nameFr: 'Soins de peau', nameEn: 'Skincare', nameAr: 'العناية بالبشرة', products: [] };
      mockPrisma.category.findUnique.mockResolvedValue(category);

      const result = await service.findOne(1);

      expect(result).toEqual(category);
      expect(mockPrisma.category.findUnique).toHaveBeenCalled();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createDto = { nameFr: 'Soins de peau', nameEn: 'Skincare', nameAr: 'العناية بالبشرة' };
      const category = { id: 1, ...createDto };
      mockPrisma.category.create.mockResolvedValue(category);

      const result = await service.create(createDto);

      expect(result).toEqual(category);
      expect(mockPrisma.category.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateDto = { nameFr: 'Updated Category' };
      const category = { id: 1, nameFr: 'Updated Category', nameEn: 'Updated', nameAr: 'محدث' };
      
      mockPrisma.category.findUnique.mockResolvedValue(category);
      mockPrisma.category.update.mockResolvedValue(category);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(category);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const category = { id: 1, nameFr: 'Soins de peau' };
      mockPrisma.category.findUnique.mockResolvedValue(category);
      mockPrisma.category.delete.mockResolvedValue(category);

      await service.remove(1);

      expect(mockPrisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
// filepath: src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const mockPrisma = {
    product: {
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
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        { id: 1, nameFr: 'Crème hydratante', nameEn: 'Moisturizing Cream', price: 29.99 },
        { id: 2, nameFr: 'Sérum vitaminé', nameEn: 'Vitamin Serum', price: 39.99 },
      ];
      mockPrisma.product.findMany.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(mockPrisma.product.findMany).toHaveBeenCalled();
    });

    it('should filter products by category', async () => {
      const products = [{ id: 1, nameFr: 'Crème hydratante', categoryId: 1 }];
      mockPrisma.product.findMany.mockResolvedValue(products);

      await service.findAll(1);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: 1 },
        include: { category: { select: { id: true, nameFr: true, nameEn: true, nameAr: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { 
        id: 1, 
        nameFr: 'Crème hydratante', 
        price: 29.99,
        category: { id: 1, nameFr: 'Skincare' },
        reviews: [],
        avgRating: null,
        reviewCount: 0
      };
      mockPrisma.product.findUnique.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(result).toHaveProperty('avgRating');
      expect(result).toHaveProperty('reviewCount');
      expect(mockPrisma.product.findUnique).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto = {
        nameFr: 'Crème hydratante',
        nameEn: 'Moisturizing Cream',
        descriptionFr: 'Description',
        descriptionEn: 'Description',
        price: 29.99,
        categoryId: 1,
      };
      const product = { id: 1, ...createDto };
      mockPrisma.product.create.mockResolvedValue(product);

      const result = await service.create(createDto);

      expect(result).toEqual(product);
      expect(mockPrisma.product.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto = { price: 34.99 };
      const product = { id: 1, nameFr: 'Crème hydratante', price: 34.99 };
      
      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.product.update.mockResolvedValue(product);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(product);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const product = { id: 1, nameFr: 'Crème hydratante' };
      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.product.delete.mockResolvedValue(product);

      await service.remove(1);

      expect(mockPrisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
// filepath: src/reviews/reviews.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  const mockPrisma = {
    review: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getProductReviews', () => {
    it('should return reviews for a product', async () => {
      const product = { id: 1, nameFr: 'Product 1' };
      const reviews = [
        { id: 1, productId: 1, userId: 1, rating: 5, comment: 'Great!', user: { firstName: 'John', lastName: 'Doe' } },
        { id: 2, productId: 1, userId: 2, rating: 4, comment: 'Good', user: { firstName: 'Jane', lastName: 'Smith' } },
      ];

      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.review.findMany.mockResolvedValue(reviews);

      const result = await service.getProductReviews(1);

      expect(result.reviews).toEqual(reviews);
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.getProductReviews(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new review', async () => {
      const createDto = { rating: 5, comment: 'Excellent product!' };
      const user = { id: 1, firstName: 'John' };
      const product = { id: 1, nameFr: 'Product 1' };
      const review = { id: 1, userId: 1, productId: 1, ...createDto, user };

      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.review.findUnique.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue(review);

      const result = await service.create(1, 1, createDto);

      expect(result).toEqual(review);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.create(1, 999, { rating: 5 })).rejects.toThrow(NotFoundException);
    });
  });
});
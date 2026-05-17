// filepath: src/cart/cart.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;

  const mockPrisma = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return user cart with items', async () => {
      const cart = {
        id: 1,
        userId: 1,
        items: [
          { id: 1, productId: 1, quantity: 2, product: { id: 1, nameFr: 'Product 1', price: 10, nameEn: '', nameAr: '', stock: 5, imageUrl: '', categoryId: 1 } },
        ],
      };
      mockPrisma.cart.findUnique.mockResolvedValue(cart);

      const result = await service.getCart(1);

      expect(result).toHaveProperty('itemCount');
      expect(result).toHaveProperty('total');
      expect(result.items).toBeDefined();
    });

    it('should create cart if not exists', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);
      const newCart = { id: 1, userId: 1, items: [] };
      mockPrisma.cart.create.mockResolvedValue(newCart);

      const result = await service.getCart(1);

      expect(result).toHaveProperty('itemCount');
      expect(result).toHaveProperty('total');
      expect(mockPrisma.cart.create).toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const product = { id: 1, nameFr: 'Product 1', price: 10 };
      const cart = { id: 1, userId: 1 };
      const cartItem = { id: 1, cartId: 1, productId: 1, quantity: 1 };

      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.cart.findUnique.mockResolvedValue(cart);
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue(cartItem);

      const result = await service.addItem(1, 1, 1);

      expect(result).toEqual(cartItem);
    });

    it('should increase quantity if item exists', async () => {
      const product = { id: 1, nameFr: 'Product 1', price: 10 };
      const cart = { id: 1, userId: 1 };
      const existingItem = { id: 1, cartId: 1, productId: 1, quantity: 1 };
      const updatedItem = { ...existingItem, quantity: 2 };

      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.cart.findUnique.mockResolvedValue(cart);
      mockPrisma.cartItem.findUnique.mockResolvedValue(existingItem);
      mockPrisma.cartItem.update.mockResolvedValue(updatedItem);

      const result = await service.addItem(1, 1, 1);

      expect(result.quantity).toBe(2);
    });
  });

  describe('updateItem', () => {
    it('should update item quantity', async () => {
      const cart = { id: 1, userId: 1 };
      const cartItem = { id: 1, cartId: 1, productId: 1, quantity: 3 };
      const product = { id: 1, stock: 10 };

      mockPrisma.cart.findUnique.mockResolvedValue(cart);
      mockPrisma.cartItem.findUnique.mockResolvedValue({ id: 1, cartId: 1, productId: 1, quantity: 1 });
      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.cartItem.update.mockResolvedValue(cartItem);

      const result = await service.updateItem(1, 1, { quantity: 3 });

      expect(result.quantity).toBe(3);
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);

      await expect(service.updateItem(1, 999, { quantity: 1 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const cartItem = { id: 1, cartId: 1, productId: 1, quantity: 1 };
      mockPrisma.cartItem.findUnique.mockResolvedValue(cartItem);
      mockPrisma.cartItem.delete.mockResolvedValue(cartItem);

      await service.removeItem(1, 1);

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const cart = { id: 1, userId: 1 };
      mockPrisma.cart.findUnique.mockResolvedValue(cart);
      mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.clearCart(1);

      expect(result.message).toBe('Cart cleared');
      expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 1 } });
    });
  });
});
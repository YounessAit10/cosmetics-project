// filepath: src/orders/orders.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  const mockPrisma = {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    cart: {
      findUnique: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order from cart', async () => {
      const cart = {
        id: 1,
        userId: 1,
        items: [
          { id: 1, productId: 1, quantity: 2, product: { id: 1, nameFr: 'Product 1', price: 10, stock: 5, imageUrl: '' } },
        ],
      };
      const order = {
        id: 1,
        userId: 1,
        total: 20,
        status: 'PENDING',
        items: [{ id: 1, productId: 1, quantity: 2, price: 10 }],
      };

      mockPrisma.cart.findUnique.mockResolvedValue(cart);
      mockPrisma.order.create.mockResolvedValue(order);
      mockPrisma.product.update.mockResolvedValue({});
      mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.create(1);

      expect(result).toEqual(order);
      expect(mockPrisma.order.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if cart is empty', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 1, items: [] });

      await expect(service.create(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return user orders', async () => {
      const orders = [
        { id: 1, userId: 1, total: 20, status: 'PENDING' },
        { id: 2, userId: 1, total: 50, status: 'COMPLETED' },
      ];
      mockPrisma.order.findMany.mockResolvedValue(orders);

      const result = await service.findAll(1);

      expect(result).toEqual(orders);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const order = { id: 1, userId: 1, total: 20, status: 'PENDING' };
      mockPrisma.order.findFirst.mockResolvedValue(order);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(order);
      expect(mockPrisma.order.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        include: { items: true },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrisma.order.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const order = { id: 1, userId: 1, status: 'PENDING' };
      const updatedOrder = { ...order, status: 'COMPLETED' };
      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockPrisma.order.update.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(1, 'COMPLETED');

      expect(result.status).toBe('COMPLETED');
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders for admin', async () => {
      const orders = [
        { id: 1, userId: 1, total: 20, status: 'PENDING' },
        { id: 2, userId: 2, total: 50, status: 'COMPLETED' },
      ];
      mockPrisma.order.findMany.mockResolvedValue(orders);

      const result = await service.getAllOrders();

      expect(result).toEqual(orders);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, items: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
// filepath: src/cart/cart.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                nameFr: true,
                nameEn: true,
                nameAr: true,
                price: true,
                stock: true,
                imageUrl: true,
                categoryId: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nameFr: true,
                  nameEn: true,
                  nameAr: true,
                  price: true,
                  stock: true,
                  imageUrl: true,
                  categoryId: true,
                },
              },
            },
          },
        },
      });

      return this.formatCart(newCart);
    }

    return this.formatCart(cart);
  }

  async addItem(userId: number, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check stock
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock for total quantity');
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              nameFr: true,
              nameEn: true,
              nameAr: true,
              price: true,
              stock: true,
              imageUrl: true,
            },
          },
        },
      });
    }

    // Add new item
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            nameFr: true,
            nameEn: true,
            nameAr: true,
            price: true,
            stock: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async updateItem(userId: number, productId: number, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (product && product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            nameFr: true,
            nameEn: true,
            nameAr: true,
            price: true,
            stock: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared' };
  }

  private formatCart(cart: any) {
    const items = cart.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        nameFr: item.product.nameFr,
        nameEn: item.product.nameEn,
        nameAr: item.product.nameAr,
        price: Number(item.product.price),
        stock: item.product.stock,
        imageUrl: item.product.imageUrl,
        categoryId: item.product.categoryId,
      },
    }));

    const total = items.reduce(
      (acc: number, item: any) => acc + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      total: Number(total.toFixed(2)),
      itemCount: items.length,
    };
  }
}
// filepath: src/cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Request() req: { user: { id: number } }) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(
    @Request() req: { user: { id: number } },
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addItem(req.user.id, addToCartDto);
  }

  @Put('items/:productId')
  updateItem(
    @Request() req: { user: { id: number } },
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, productId, updateCartItemDto);
  }

  @Delete('items/:productId')
  removeItem(
    @Request() req: { user: { id: number } },
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  clearCart(@Request() req: { user: { id: number } }) {
    return this.cartService.clearCart(req.user.id);
  }
}
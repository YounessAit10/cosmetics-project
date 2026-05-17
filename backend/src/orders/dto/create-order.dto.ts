// filepath: src/orders/dto/create-order.dto.ts
import { IsOptional, IsInt, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOrderDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  addressId?: number;
}

export class UpdateOrderStatusDto {
  @IsIn(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}
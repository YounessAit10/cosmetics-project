// filepath: src/cart/dto/update-cart-item.dto.ts
import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartItemDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  quantity: number;
}
// filepath: src/cart/dto/add-to-cart.dto.ts
import { IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddToCartDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  quantity: number;
}
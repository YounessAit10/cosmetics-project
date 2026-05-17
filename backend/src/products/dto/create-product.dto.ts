// filepath: src/products/dto/create-product.dto.ts
import { IsString, IsOptional, IsNumber, IsUrl, Min, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  nameFr: string;

  @IsString()
  nameEn: string;

  @IsString()
  nameAr: string;

  @IsString()
  @IsOptional()
  descriptionFr?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  price: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  stock: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  categoryId?: number;
}
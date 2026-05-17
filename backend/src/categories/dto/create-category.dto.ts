// filepath: src/categories/dto/create-category.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateCategoryDto {
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

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
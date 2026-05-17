// filepath: src/reviews/dto/create-review.dto.ts
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
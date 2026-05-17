// filepath: src/users/dto/update-preferences.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsOptional()
  @IsIn(['fr', 'en', 'ar'])
  language?: string;

  @IsString()
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;
}
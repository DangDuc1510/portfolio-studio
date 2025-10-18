import { IsBoolean, IsOptional, IsObject } from 'class-validator';

export class UpdateHomepageSectionDto {
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsObject()
  content?: Record<string, any>;
}

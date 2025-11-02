import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends OmitType(PartialType(CreateProductDto), ['albumId'] as const) {
  @IsOptional()
  @ValidateIf((o) => o.albumId !== null)
  @IsString()
  albumId?: string | null;
}

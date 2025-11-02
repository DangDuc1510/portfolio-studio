import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'contacted', 'scheduled', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

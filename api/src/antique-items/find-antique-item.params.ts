import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationParams } from '../common/pagination.params';

export class FindAntiqueItemParams extends PaginationParams {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

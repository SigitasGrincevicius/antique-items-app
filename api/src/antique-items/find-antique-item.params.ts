import { IsOptional, IsUUID } from 'class-validator';
import { PaginationParams } from '../common/pagination.params';

export class FindAntiqueItemParams extends PaginationParams {
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationParams } from '../common/pagination.params';
import { Transform } from 'class-transformer';

export class FindAntiqueItemParams extends PaginationParams {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;

    return value
      .split(',')
      .map((category) => category.trim())
      .filter((category) => category.length);
  })
  categories?: string[];

  @IsOptional()
  @IsIn(['name', 'category', 'createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

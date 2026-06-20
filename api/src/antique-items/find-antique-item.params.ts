import { IsOptional, IsUUID } from 'class-validator';

export class FindAntiqueItemParams {
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

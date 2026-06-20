import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAntiqueItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  origin!: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1000)
  @Max(2100)
  year!: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(1_000_000_000)
  priceEur!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  createdById!: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
}

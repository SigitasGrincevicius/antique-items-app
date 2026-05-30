import { IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';

export class CreateAntiqueItemDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  origin!: string;

  @IsNotEmpty()
  @IsNumber()
  year!: number;
  
  @IsNotEmpty()
  @IsNumber()
  priceEur!: number;
}

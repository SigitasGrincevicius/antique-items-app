import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
   @Transform(({ value }) =>
      typeof value === 'string' ? value.trim().toLocaleLowerCase() : value,
   )
   @IsNotEmpty()
   @IsString()
   @MaxLength(255)
   @IsEmail()
   email!: string;

   @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
   @IsNotEmpty()
   @IsString()
   password!: string;
}
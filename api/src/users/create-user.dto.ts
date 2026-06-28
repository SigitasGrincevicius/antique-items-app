import strict from 'assert/strict';
import { IsEmail, isNotEmpty, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

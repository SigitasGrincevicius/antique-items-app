import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return { accessToken }; // "c5f4f507-52fe-4f2a-8af9-981cc02fa193"	"2026-06-16 05:57:35.578401"	"2026-06-16 05:57:35.578401"	"Skywalker"	"skywalker@sw.com"	"$2b$10$PL69mnFjQIhcBFi/rOhzDejgyzsTAuGBMap2V.Gxn8DP.CH9comZ."
  }
}

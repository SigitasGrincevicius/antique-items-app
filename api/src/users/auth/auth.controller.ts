import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  SerializeOptions,
  Request,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import type { AuthRequest } from '../auth.request';
import { UsersService } from '../users/users.service';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return plainToInstance(LoginResponse, { accessToken });
  }

  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.usersService.findOneById(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }
}

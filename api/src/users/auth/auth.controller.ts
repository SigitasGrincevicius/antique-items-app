import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  SerializeOptions,
  Request,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login.response';
import type { AuthRequest } from './interfaces/auth-request.interface';
import { UsersService } from '../users.service';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from './role.enum';

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

  @Patch('users/:id/grant-admin')
  @Roles(Role.ADMIN)
  async grantAdminRole(@Param('id') userId: string): Promise<User> {
    return this.usersService.grantAdminRole(userId);
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

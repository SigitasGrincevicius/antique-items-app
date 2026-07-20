import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthConfig } from '../config/config.types';
import { PasswordService } from './auth/password/password.service';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<AuthConfig>('auth')?.secret,
        signOptions: {
          expiresIn: config.get<AuthConfig>('auth')?.expiresIn,
        },
      }),
    }),
  ],
  providers: [
    PasswordService,
    UsersService,
    AuthService,
    AuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
})
export class UsersModule {}

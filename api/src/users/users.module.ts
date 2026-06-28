import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthConfig } from '../config/config.types';

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
})
export class UsersModule {}

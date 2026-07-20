import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { PasswordService } from './password/password.service';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.usersService.findOneByEmail(email);

    // There is no such user
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Password is invalid
    if (!(await this.passwordService.verify(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, name: user.name, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}

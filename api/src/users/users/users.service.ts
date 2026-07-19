import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../create-user.dto';
import { Role } from '../role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  // Find user by email
  public findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('User with provided email already exists');
      }

      throw error;
    }
  }

  // Find user by id
  public async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (user) return user;

    throw new NotFoundException('User not found');
  }

  public async grantAdminRole(userId: string): Promise<User> {
    const user = await this.findOneById(userId);

    if (!user.roles.includes(Role.ADMIN)) {
      user.roles.push(Role.ADMIN);
      await this.userRepository.save(user);
    }

    return user;
  }
}

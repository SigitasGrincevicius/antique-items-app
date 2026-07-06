import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  // Find user by email
  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) return user;

    throw new NotFoundException();
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hash(
      createUserDto.password,
    );

    return await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  // Find user by id
  public async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (user) return user;

    throw new NotFoundException();
  }
}

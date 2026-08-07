import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Role } from './role.enum';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    createUser: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const passwordServiceMock = {
    verify: jest.fn(),
  };

  const createUserDto = {
    name: 'Luke Skywalker',
    email: 'luke@example.com',
    password: 'Secret123!',
  } satisfies CreateUserDto;

  const user: User = {
    id: 'user-1',
    name: createUserDto.name,
    email: createUserDto.email,
    password: 'hashed-password',
    roles: [Role.USER],
    createdAt: new Date(),
    updatedAt: new Date(),
    antiqueItems: [],
    favoritedItems: [],
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: PasswordService,
          useValue: passwordServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('creates and returns a user', async () => {
      usersServiceMock.createUser.mockResolvedValue(user);

      await expect(service.register(createUserDto)).resolves.toEqual(user);

      expect(usersServiceMock.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {});
});

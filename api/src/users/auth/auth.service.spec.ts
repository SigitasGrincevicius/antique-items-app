import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Role } from './role.enum';
import { UnauthorizedException } from '@nestjs/common';

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

  describe('login', () => {
    it('returns a signed token for valid credentials', async () => {
      usersServiceMock.findOneByEmail.mockResolvedValue(user);
      passwordServiceMock.verify.mockResolvedValue(true);
      jwtServiceMock.sign.mockReturnValue('signed-token');

      await expect(
        service.login(user.email, createUserDto.password),
      ).resolves.toBe('signed-token');

      expect(usersServiceMock.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(passwordServiceMock.verify).toHaveBeenCalledWith(
        createUserDto.password,
        user.password,
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: user.id,
        name: user.name,
        roles: user.roles,
      });
    });

    it('throws UnauthorizedException when the user does not exist', async () => {
      usersServiceMock.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.login('missing@example.com', createUserDto.password),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

      expect(passwordServiceMock.verify).not.toHaveBeenCalled();
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when the password is invalid', async () => {
      usersServiceMock.findOneByEmail.mockResolvedValue(user);
      passwordServiceMock.verify.mockResolvedValue(false);

      await expect(
        service.login(user.email, 'WrongPassword1!'),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

      expect(passwordServiceMock.verify).toHaveBeenCalledWith(
        'WrongPassword1!',
        user.password,
      );
      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });
});

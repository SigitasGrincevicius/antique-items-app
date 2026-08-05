import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PasswordService } from './auth/password/password.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const userRepositoryMock = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const passwordServiceMock = {
    hash: jest.fn(),
  };

  const createUserDto = {
    name: 'Luke Skywalker',
    email: 'luke@example.com',
    password: 'secret123',
  } as CreateUserDto;

  const user: User = {
    id: 'user-1',
    name: createUserDto.name,
    email: createUserDto.email,
    password: 'hashed-password',
    roles: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    antiqueItems: [],
    favoritedItems: [],
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: PasswordService,
          useValue: passwordServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findOneByEmail', () => {
    it('returns a user found by email', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(user);

      await expect(service.findOneByEmail(user.email)).resolves.toEqual(user);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: user.email,
      });
    });

    it('returns null when the user does not exist', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        service.findOneByEmail('missing@example.com'),
      ).resolves.toBeNull();
    });
  });

  describe('createUser', () => {
    it('hashes the password and saves the created user', async () => {
      passwordServiceMock.hash.mockResolvedValue('hashed-password');
      userRepositoryMock.create.mockReturnValue(user);
      userRepositoryMock.save.mockResolvedValue(user);

      await expect(service.createUser(createUserDto)).resolves.toEqual(user);

      expect(passwordServiceMock.hash).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed-password',
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(user);
    });
  });
});

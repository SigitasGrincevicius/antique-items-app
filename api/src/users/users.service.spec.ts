import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PasswordService } from './auth/password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFailedError } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from './auth/role.enum';

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

    it('throws ConflictException when the email already exists', async () => {
      const driverError = Object.assign(new Error('Duplicate email'), {
        code: '23505',
      });
      const duplicateEmailError = new QueryFailedError(
        'INSERT INTO users',
        [],
        driverError,
      );

      passwordServiceMock.hash.mockResolvedValue('hashed-password');
      userRepositoryMock.create.mockReturnValue(user);
      userRepositoryMock.save.mockRejectedValue(duplicateEmailError);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new ConflictException('User with provided email already exists'),
      );
    });

    it('rethrows an unexpected repository error', async () => {
      const repositoryError = new Error('Database unavailable');

      passwordServiceMock.hash.mockResolvedValue('hashed-password');
      userRepositoryMock.create.mockReturnValue(user);
      userRepositoryMock.save.mockRejectedValue(repositoryError);

      await expect(service.createUser(createUserDto)).rejects.toBe(
        repositoryError,
      );
    });

    describe('findOneById', () => {
      it('returns user if it exists', async () => {
        userRepositoryMock.findOneBy.mockResolvedValue(user);

        await expect(service.findOneById(user.id)).resolves.toEqual(user);

        expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
          id: user.id,
        });
      });

      it('throws NotFoundException when the user does not exist', async () => {
        userRepositoryMock.findOneBy.mockResolvedValue(null);

        await expect(service.findOneById('missing-user')).rejects.toThrow(
          new NotFoundException('User not found'),
        );
      });
    });

    describe('grantAdminRole', () => {
      it('adds the admin role and saves the user', async () => {
        const regularUser = {
          ...user,
          roles: [],
        } as User;

        userRepositoryMock.findOneBy.mockResolvedValue(regularUser);
        userRepositoryMock.save.mockResolvedValue(regularUser);

        await expect(service.grantAdminRole(regularUser.id)).resolves.toEqual(
          regularUser,
        );

        expect(regularUser.roles).toContain(Role.ADMIN);
        expect(userRepositoryMock.save).toHaveBeenCalledWith(regularUser);
      });

      it('does not save a user who already has the admin role', async () => {
        const adminUser: User = {
          ...user,
          roles: [Role.ADMIN],
        };

        userRepositoryMock.findOneBy.mockResolvedValue(adminUser);

        await expect(service.grantAdminRole(adminUser.id)).resolves.toEqual(
          adminUser,
        );

        expect(adminUser.roles).toEqual([Role.ADMIN]);
        expect(userRepositoryMock.save).not.toHaveBeenCalled();
      });

      it('throws NotFoundException when the user does not exist', async () => {
        userRepositoryMock.findOneBy.mockResolvedValue(null);

        await expect(
          service.grantAdminRole('missing-user'),
        ).rejects.toBeInstanceOf(NotFoundException);

        expect(userRepositoryMock.save).not.toHaveBeenCalled();
      });
    });
  });
});

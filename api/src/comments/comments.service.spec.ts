import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AntiqueItem } from '../antique-items/entities/antique-item.entity';
import { Role } from '../users/auth/role.enum';
import { AuthUser } from '../users/auth/interfaces/auth-request.interface';
import { Comment } from './entities/comment.entity';

describe('CommentsService', () => {
  let service: CommentsService;

  const commentsRepositoryMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const antiqueItemsRepositoryMock = {
    existsBy: jest.fn(),
  };

  const itemId = '5f04a580-e17e-4c52-9d17-1a71e984be20';
  const commentId = 'd2401950-b027-4254-ac20-c71963bc8262';
  const parentCommentId = 'fb60b567-774f-4da8-8313-98b4315b6736';
  const ownerId = 'a7f70e7b-c357-43b8-93b6-faa4990e871e';

  const owner = {
    sub: ownerId,
    name: 'Luke Skywalker',
    roles: [Role.USER],
  } satisfies AuthUser;

  const nonOwner = {
    sub: '6fa61cf7-d8a9-44da-b18d-a149727595f1',
    name: 'Ahsoka Tano',
    roles: [Role.USER],
  } satisfies AuthUser;

  const admin = {
    ...nonOwner,
    roles: [Role.ADMIN],
  } satisfies AuthUser;

  const comment = {
    id: commentId,
    content: 'Beautiful pocket watch',
    antiqueItemId: itemId,
    authorId: ownerId,
    parentCommentId: null,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies Partial<Comment>;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: commentsRepositoryMock,
        },
        {
          provide: getRepositoryToken(AntiqueItem),
          useValue: antiqueItemsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('dummy test', () => {
    expect(1).toEqual(1);
  });
});

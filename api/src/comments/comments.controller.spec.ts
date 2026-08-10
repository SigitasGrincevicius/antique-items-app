import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { Role } from '../users/auth/role.enum';
import type { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;

  const commentsServiceMock = {
    findForItem: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const itemId = '5f04a580-e17e-4c52-9d17-1a71e984be20';
  const commentId = 'd2401950-b027-4254-ac20-c71963bc8262';
  const userId = 'a7f70e7b-c357-43b8-93b6-faa4990e871e';

  const user = {
    sub: userId,
    name: 'Luke Skywalker',
    roles: [Role.USER],
  };

  const comment = {
    id: commentId,
    content: 'Beautiful pocket watch!',
    antiqueItemId: itemId,
    authorId: userId,
    parentCommentId: null,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies Partial<Comment>;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: commentsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  describe('findForItem', () => {
    it('returns comments for an antique item', async () => {
      commentsServiceMock.findForItem.mockResolvedValue([comment]);

      await expect(controller.findForItem(itemId)).resolves.toEqual([comment]);

      expect(commentsServiceMock.findForItem).toHaveBeenCalledWith(itemId);
    });
  });
});

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

  describe('create', () => {
    it('creates a comment for an antique item', async () => {
      const dto = {
        content: 'Beautiful pocket watch!',
      };

      commentsServiceMock.create.mockResolvedValue(comment);

      await expect(controller.create(itemId, dto, userId)).resolves.toEqual(
        comment,
      );

      expect(commentsServiceMock.create).toHaveBeenCalledWith(
        itemId,
        dto,
        userId,
      );
      expect(commentsServiceMock.create).toHaveBeenCalledTimes(1);
    });

    it('creates reply to another comment', async () => {
      const dto = {
        content: 'I agree!',
        parrentCommentId: commentId,
      };

      const reply = {
        ...comment,
        id: '7d246508-1d0b-4463-a070-196084b9183e',
        content: dto.content,
        parentCommentId: commentId,
      };

      commentsServiceMock.create.mockResolvedValue(reply);

      await expect(controller.create(itemId, dto, userId)).resolves.toEqual(
        reply,
      );

      expect(commentsServiceMock.create).toHaveBeenCalledWith(
        itemId,
        dto,
        userId,
      );
    });
  });

  describe('update', () => {
    it('updates a comment', async () => {
      const dto = {
        content: 'Updated comment',
      };

      const updatedComment = {
        ...comment,
        content: dto.content,
      };

      commentsServiceMock.update.mockResolvedValue(updatedComment);

      await expect(controller.update(commentId, dto, user)).resolves.toEqual(
        updatedComment,
      );

      expect(commentsServiceMock.update).toHaveBeenCalledWith(
        commentId,
        dto,
        user,
      );
      expect(commentsServiceMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('deletes a comment', async () => {
      commentsServiceMock.delete.mockResolvedValue(undefined);

      await expect(controller.delete(commentId, user)).resolves.toBeUndefined();

      expect(commentsServiceMock.delete).toHaveBeenCalledWith(commentId, user);
      expect(commentsServiceMock.delete).toHaveBeenCalledTimes(1);
    });
  });
});

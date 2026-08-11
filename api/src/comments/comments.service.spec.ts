import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AntiqueItem } from '../antique-items/entities/antique-item.entity';
import { Role } from '../users/auth/role.enum';
import type { AuthUser } from '../users/auth/interfaces/auth-request.interface';
import { Comment } from './entities/comment.entity';
import { IsNull } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
  const anotherItemId = '7ef4f897-49af-4be0-9c93-f0cd27b2b173';
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

  describe('findForItem', () => {
    it('returns top-level comments for an existing antique item', async () => {
      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(true);
      commentsRepositoryMock.find.mockResolvedValue([comment]);

      await expect(service.findForItem(itemId)).resolves.toEqual([comment]);

      expect(antiqueItemsRepositoryMock.existsBy).toHaveBeenCalledWith({
        id: itemId,
      });

      expect(commentsRepositoryMock.find).toHaveBeenCalledWith({
        where: {
          antiqueItemId: itemId,
          parentCommentId: IsNull(),
        },
        relations: {
          author: true,
          replies: {
            author: true,
          },
        },
        order: {
          createdAt: 'DESC',
          replies: {
            createdAt: 'DESC',
          },
        },
      });
    });

    it('throws when the antique item does not exist', async () => {
      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(false);

      await expect(service.findForItem(itemId)).rejects.toThrow(
        new NotFoundException(`Antique item ${itemId} was not found`),
      );

      expect(commentsRepositoryMock.find).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('creates a top-level comment', async () => {
      const dto = {
        content: 'Great pocket watch',
      };

      const createdComment = {
        ...comment,
        parentCommentId: null,
      };

      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(true);
      commentsRepositoryMock.create.mockReturnValue(createdComment);
      commentsRepositoryMock.save.mockResolvedValue(createdComment);

      await expect(service.create(itemId, dto, ownerId)).resolves.toEqual(
        createdComment,
      );

      expect(antiqueItemsRepositoryMock.existsBy).toHaveBeenCalledWith({
        id: itemId,
      });

      expect(commentsRepositoryMock.create).toHaveBeenCalledWith({
        content: dto.content,
        antiqueItemId: itemId,
        authorId: ownerId,
        parentCommentId: null,
      });

      expect(commentsRepositoryMock.save).toHaveBeenCalledWith(createdComment);
    });

    it('creates a reply to a comment from the same antique item', async () => {
      const dto = {
        content: 'I Agree!',
        parentCommentId,
      };

      const parentComment = {
        ...comment,
        id: parentCommentId,
      };

      const reply = {
        ...comment,
        id: '7d246508-1d0b-4463-a070-196084b9183e',
        content: dto.content,
        parentCommentId,
      };

      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(true);
      commentsRepositoryMock.findOneBy.mockResolvedValue(parentComment);
      commentsRepositoryMock.create.mockReturnValue(reply);
      commentsRepositoryMock.save.mockResolvedValue(reply);

      await expect(service.create(itemId, dto, ownerId)).resolves.toEqual(
        reply,
      );

      expect(commentsRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: parentCommentId,
      });

      expect(commentsRepositoryMock.create).toHaveBeenCalledWith({
        content: dto.content,
        antiqueItemId: itemId,
        authorId: ownerId,
        parentCommentId,
      });

      expect(commentsRepositoryMock.save).toHaveBeenCalledWith(reply);
    });

    it('throws when the antique item does not exist', async () => {
      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(false);

      await expect(
        service.create(itemId, { content: 'Comment' }, ownerId),
      ).rejects.toThrow(
        new NotFoundException(`Antique item ${itemId} was not found`),
      );

      expect(commentsRepositoryMock.findOneBy).not.toHaveBeenCalled();
      expect(commentsRepositoryMock.create).not.toHaveBeenCalled();
      expect(commentsRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('throws when the parent comment does not exist', async () => {
      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(true);
      commentsRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        service.create(itemId, { content: 'Reply', parentCommentId }, ownerId),
      ).rejects.toThrow(
        new NotFoundException(`Comment ${parentCommentId} was not found`),
      );

      expect(commentsRepositoryMock.create).not.toHaveBeenCalled();
      expect(commentsRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('forbids replying to a comment from another antique item', async () => {
      antiqueItemsRepositoryMock.existsBy.mockResolvedValue(true);
      commentsRepositoryMock.findOneBy.mockResolvedValue({
        ...comment,
        id: parentCommentId,
        antiqueItemId: anotherItemId,
      });

      await expect(
        service.create(itemId, { content: 'Reply', parentCommentId }, ownerId),
      ).rejects.toThrow(
        new ForbiddenException(
          'Cannot reply to a comment from another antique item',
        ),
      );

      expect(commentsRepositoryMock.create).not.toHaveBeenCalled();
      expect(commentsRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('allows the owner to update a comment', async () => {
      const existingComment = { ...comment };
      const dto = { content: 'Updated comment' };

      commentsRepositoryMock.findOneBy.mockResolvedValue(existingComment);
      commentsRepositoryMock.save.mockImplementation((value) =>
        Promise.resolve(value),
      );

      await expect(service.update(commentId, dto, owner)).resolves.toEqual({
        ...existingComment,
        content: dto.content,
      });

      expect(commentsRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: commentId,
      });
      expect(commentsRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: commentId,
          content: dto.content,
        }),
      );
    });

    it('allows an administrator to update another user comment', async () => {
      const existingComment = { ...comment };
      const dto = { content: 'Updated by admin' };

      commentsRepositoryMock.findOneBy.mockResolvedValue(existingComment);
      commentsRepositoryMock.save.mockImplementation((value) =>
        Promise.resolve(value),
      );

      await expect(service.update(commentId, dto, admin)).resolves.toEqual({
        ...existingComment,
        content: dto.content,
      });
    });

    it('forbids a non-owner from updating a comment', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue({ ...comment });

      await expect(
        service.update(commentId, { content: 'Unauthorized' }, nonOwner),
      ).rejects.toThrow(
        new ForbiddenException(
          'You do not have permission to modify this comment',
        ),
      );

      expect(commentsRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('throws when the comment does not exist', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(commentId, { content: 'Updated comment' }, owner),
      ).rejects.toThrow(
        new NotFoundException(`Comment ${commentId} was not found`),
      );

      expect(commentsRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('allows the owner to delete a comment', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue({ ...comment });
      commentsRepositoryMock.delete.mockResolvedValue({ affected: 1 });

      await expect(service.delete(commentId, owner)).resolves.toBeUndefined();

      expect(commentsRepositoryMock.delete).toHaveBeenCalledWith(commentId);
    });

    it('allows an administrator to delete another user comment', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue({ ...comment });
      commentsRepositoryMock.delete.mockResolvedValue({ affected: 1 });

      await expect(service.delete(commentId, admin)).resolves.toBeUndefined();

      expect(commentsRepositoryMock.delete).toHaveBeenCalledWith(commentId);
    });

    it('forbids a non-owner from deleting a comment', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue({ ...comment });

      await expect(service.delete(commentId, nonOwner)).rejects.toThrow(
        new ForbiddenException(
          'You do not have permission to modify this comment',
        ),
      );

      expect(commentsRepositoryMock.delete).not.toHaveBeenCalled();
    });

    it('throws when the comment does not exist', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue(null);

      await expect(service.delete(commentId, owner)).rejects.toThrow(
        new NotFoundException(`Comment ${commentId} was not found`),
      );

      expect(commentsRepositoryMock.delete).not.toHaveBeenCalled();
    });

    it('throws when the repository does not delete the comment', async () => {
      commentsRepositoryMock.findOneBy.mockResolvedValue({ ...comment });
      commentsRepositoryMock.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(commentId, owner)).rejects.toThrow(
        new NotFoundException(`Comment ${commentId} was not found`),
      );
    });
  });
});

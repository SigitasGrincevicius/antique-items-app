import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { AntiqueItem } from '../antique-items/entities/antique-item.entity';
import type { AuthUser } from '../users/auth/interfaces/auth-request.interface';
import { Role } from '../users/auth/role.enum';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(AntiqueItem)
    private readonly antiqueItemsRepository: Repository<AntiqueItem>,
  ) {}

  public async findForItem(itemId: string): Promise<Comment[]> {
    await this.checkIfItemExists(itemId);

    return this.commentsRepository.find({
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
  }

  public async create(
    itemId: string,
    dto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    await this.checkIfItemExists(itemId);

    if (dto.parentCommentId) {
      const parentComment = await this.findOneOrFail(dto.parentCommentId);

      if (parentComment.antiqueItemId !== itemId) {
        throw new ForbiddenException(
          'Cannot reply to a comment from another antique item',
        );
      }
    }

    const comment = this.commentsRepository.create({
      content: dto.content,
      antiqueItemId: itemId,
      authorId,
      parentCommentId: dto.parentCommentId ?? null,
    });

    return this.commentsRepository.save(comment);
  }

  public async update(
    commentId: string,
    dto: UpdateCommentDto,
    user: AuthUser,
  ): Promise<Comment> {
    const comment = await this.findOneOrFail(commentId);

    this.checkOwnership(comment, user);

    comment.content = dto.content;

    return this.commentsRepository.save(comment);
  }

  private async findOneOrFail(commentId: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({
      id: commentId,
    });

    if (!comment) {
      throw new NotFoundException(`Comment ${commentId} was not found`);
    }

    return comment;
  }

  public async delete(commentId: string, user: AuthUser): Promise<void> {
    const comment = await this.findOneOrFail(commentId);

    this.checkOwnership(comment, user);

    const result = await this.commentsRepository.delete(comment.id);

    if (!result.affected) {
      throw new NotFoundException(`Comment ${commentId} was not found`);
    }
  }

  private async checkIfItemExists(itemId: string): Promise<void> {
    const itemExists = await this.antiqueItemsRepository.existsBy({
      id: itemId,
    });

    if (!itemExists) {
      throw new NotFoundException(`Antique item ${itemId} was not found`);
    }
  }

  private checkOwnership(comment: Comment, user: AuthUser): void {
    const isOwner = comment.authorId === user.sub;
    const isAdmin = (user.roles ?? []).includes(Role.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to modify this comment',
      );
    }
  }
}

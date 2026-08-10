import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUserId } from '../users/auth/decorators/current-user-id.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';
import type { AuthUser } from '../users/auth/interfaces/auth-request.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('antique-items/::itemId/comments')
  public findForItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.commentsService.findForItem(itemId);
  }

  @Post('antique-items/:itemId/comments')
  public create(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUserId() userId: string,
  ) {
    return this.commentsService.create(itemId, dto, userId);
  }

  @Patch('comments/:commentId')
  public update(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.update(commentId, dto, user);
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.delete(commentId, user);
  }
}

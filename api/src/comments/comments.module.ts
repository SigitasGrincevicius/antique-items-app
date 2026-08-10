import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntiqueItem } from '../antique-items/entities/antique-item.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, AntiqueItem])],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}

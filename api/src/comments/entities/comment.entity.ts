import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AntiqueItem } from '../../antique-items/entities/antique-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'uuid' })
  antiqueItemId!: string;

  @ManyToOne(() => AntiqueItem, (item) => item.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'antiqueItemId' })
  antiqueItem!: AntiqueItem;

  @Column({ type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @Column({ type: 'uuid', nullable: true })
  parentCommentId!: string | null;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment!: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

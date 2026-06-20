import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class AntiqueItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  origin?: string;

  @Column('smallint')
  year!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  priceEur!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  categoryId!: string;

  @Column({ nullable: true })
  createdById!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.antiqueItems, { nullable: true })
  createdBy!: User;

  @ManyToOne(() => Category, (category) => category.antiqueItems, {
    nullable: false,
  })
  category!: Category;
}

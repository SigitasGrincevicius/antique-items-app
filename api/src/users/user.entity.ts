import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { AntiqueItem } from '../antique-items/antique-item.entity';
import { Role } from './role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Expose()
  name!: string;

  @Column()
  password!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @Expose()
  email!: string;

  @CreateDateColumn()
  @Expose()
  createdAt!: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt!: Date;

  @OneToMany(() => AntiqueItem, (item) => item.createdBy)
  @Expose()
  antiqueItems!: AntiqueItem[];

  @Column('text', { array: true, default: [Role.USER] })
  @Expose()
  roles!: Role[];
}

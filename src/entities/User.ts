import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { ComPost, ComComment } from './index';
import { ProviderType, GenderType } from '../model';


@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  nickname: string;

	@Column({
		unique: false,
		nullable: false,
	})
	annonymous_nick: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
    unique: false,
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.LOCAL,
  })
  provider: string;

  @Column({
    unique: false,
    nullable: true,
  })
  point: number;

	@Column({
		unique: false,
		nullable: false,
		type: 'enum',
		enum: GenderType,
		default: GenderType.UNKNOWN,
	})
	gender: string;

	@Column({
		unique: false,
		nullable: true,
	})
	birty_year: number;

	@Column({
		unique: false,
		nullable: true,
	})
	birty_month: number;

	@Column({
		unique: false,
		nullable: true,
	})
	birty_day: number;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


	@OneToMany(
		() => ComPost,
		com_posts => com_posts.user
	)
	com_posts: ComPost[];

	@OneToMany(
		() => ComComment,
		com_comments => com_comments.user
	)
	com_comments: ComComment[];
}
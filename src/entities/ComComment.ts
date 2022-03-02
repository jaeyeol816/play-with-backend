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
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { User, ComPost } from './index';

@Entity('com_comments')
export class ComComment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: false,
		nullable: true,
		type: "text",
	})
	text: string;


	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(
		() => User,
		user => user.com_comments,
		{ cascade: true },
	)
	@JoinColumn({
		name: 'user_id',
	})
	user: User;

	@ManyToOne(
		() => ComPost,
		com_post => com_post.com_comments,
		{ cascade: true },
	)
	@JoinColumn({
		name: 'com_post_id',
	})
	com_post: ComPost;
}
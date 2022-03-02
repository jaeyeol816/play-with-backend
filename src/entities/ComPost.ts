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

import { User, ComComment } from './index';

@Entity('com_posts') 
export class ComPost extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
		nullable: true,
	})
	image: string;

	@Column({
		unique: false,
		nullable: true,
		type: "longtext",
	})
	text: string;

	@Column({
		unique: false,
		nullable: false,
		default: 0,
	})
	views: number;


	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;


	@ManyToOne(
		() => User,
		user => user.com_posts,
		{ cascade: true }
	)
	@JoinColumn({
		name: 'user_id',
	})
	user: User;

	@OneToMany(
		() => ComComment,
		com_comments => com_comments.com_post
	)
	com_comments: ComComment[];
}


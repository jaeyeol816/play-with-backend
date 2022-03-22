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
	
	@Column({
		unique: true,
		nullable: true,
	})
	image: string;


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
		{ cascade: true, onDelete: 'SET NULL' },
	)
	@JoinColumn({
		name: 'com_post_id',
	})
	com_post: ComPost;

	//n:m이 아니라서 테이블 안만드는듯?
	@ManyToOne(
		() => ComComment, 
		comComment => comComment.replied, 
		{ cascade: true, onDelete: 'SET NULL' }
	)
	// @JoinTable({
	// 	name: 'replys',
	// 	joinColumn: {
	// 		name: 'parent_comment',
	// 	},
	// 	inverseJoinColumn: {
	// 		name: 'child_comment',
	// 	}
	// })
	@JoinColumn({
		name: 'replies_id',
	})
	replies: ComComment;

	@OneToMany(() => ComComment, comComment => comComment.replies)
	replied: ComComment[];
}
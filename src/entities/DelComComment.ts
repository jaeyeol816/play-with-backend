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

import { ComComment } from './index';

@Entity('del_com_comments')
export class DelComComment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	original_id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	original_user_id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	original_post_id: number;

	@Column({
		unique: false,
		nullable: true,
	})
	replies_comment_id: number;

	@Column({
		unique: false,
		nullable: true,
	})
	text: string;

	@Column({
		unique: false,
		nullable: true,
	})
	image: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}


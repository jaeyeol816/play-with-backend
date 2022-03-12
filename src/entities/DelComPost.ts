import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SubjectType } from '../model';


@Entity('del_com_posts')
export class DelComPost extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	original_user_id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	image: string;

	@Column({
		unique: false,
		nullable: false,
		type: 'longtext',
	})
	text: string;

	@Column({
		unique: false,
		nullable: false,
	})
	views: number;

	@Column({
		unique: false,
		nullable: false,
	})
	title: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
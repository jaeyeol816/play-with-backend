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
	original_id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	original_user_id: number;


	@Column({
		unique: false,
		nullable: true,
	})
	image: string;

	@Column({
		unique: false,
		nullable: true,
		type: 'longtext',
	})
	text: string;

	@Column({
		unique: false,
		nullable: true,
	})
	views: number;

	@Column({
		unique: false,
		nullable: true,
	})
	title: string;
	
	@Column({
		unique: false,
		nullable: true,
		type: 'enum',
		enum: SubjectType,
		default: SubjectType.NO_DEFINED,
	})
	subject: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
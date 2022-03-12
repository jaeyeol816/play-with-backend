import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProviderType, GenderType } from '../model';


@Entity('del_users')
export class DelUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: false,
		nullable: false,
	})
	original_id: number;

	@Column({
		unique: false,
		nullable: true,
	})
	nickname: string;

	@Column({
		unique: false,
		nullable: true,
	})
	email: string;

	@Column({
		unique: false,
		nullable: true,
	})
	password: string;

	@Column({
		unique: false,
		nullable: true,
		type: 'enum',
		enum: ProviderType,
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
	annonymous_nick: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
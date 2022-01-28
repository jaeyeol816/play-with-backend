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

export enum ProviderType {
  LOCAL = 'local',
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
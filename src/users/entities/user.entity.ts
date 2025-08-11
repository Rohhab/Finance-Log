import { Exclude, Expose } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';
import { RefreshToken } from 'auth/entities/refresh-token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  @IsEmail()
  username: string;

  @Column()
  @Exclude()
  @MinLength(6)
  password: string;

  @CreateDateColumn()
  @Expose()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
  @Exclude()
  refreshTokens: RefreshToken[];
}

import { BankAccount } from 'bank-accounts/entities/bank-account.entity';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsIn, MinLength } from 'class-validator';
import { AuthProvider } from 'common/enums/auth-provider.enum';
import { RefreshToken } from 'iam/auth/entities/refresh-token.entity';
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

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  @MinLength(6)
  password: string | null;

  @IsIn(Object.values(AuthProvider))
  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  @Expose()
  provider: string;

  @CreateDateColumn()
  @Expose()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  @Exclude()
  refreshTokens: RefreshToken[];

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.userId)
  bankAccounts: BankAccount[];
}

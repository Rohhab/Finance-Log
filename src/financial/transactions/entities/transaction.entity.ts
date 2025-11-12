import { BankAccount } from 'financial/bank-accounts/entities/bank-account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { TransactionType } from 'common/enums/transaction-type.enum';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  performed_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => BankAccount, (bankAccount) => bankAccount.transactions)
  bankAccount: BankAccount;

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;
}

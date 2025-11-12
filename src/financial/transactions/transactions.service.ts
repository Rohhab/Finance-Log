import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { BankAccount } from 'financial/bank-accounts/entities/bank-account.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  createTransaction() {
    return this.transactionRepository.create();
  }
}

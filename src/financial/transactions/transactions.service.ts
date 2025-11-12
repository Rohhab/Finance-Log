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
    // we need to create a transaction:
    // Each xaction shall have a user
    // Then we have to intercept user id in the controller and pass it here
    // Each xaction is related to a certain category, either previously created or to be created on the fly
    // Each xaction is related to one and only one bank account. Then user might want to share that data through the controller. We check here if the account is owned by that user.
    // Finally we persist the data containing the userId, transaction ammount, type (shouldn't we pre-define types like withdrawal etc.?), category and bank account to the database.
  }
}

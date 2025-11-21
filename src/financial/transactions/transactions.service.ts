import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { BankAccount } from 'financial/bank-accounts/entities/bank-account.entity';
import { Category } from './entities/category.entity';
import { TransactionType } from 'common/enums/transaction-type.enum';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseTransactionDto } from './dtos/response-transaction.dto';

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

  async createTransaction(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ) {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: { id: createTransactionDto.bankAccountId, user: { id: userId } },
      relations: ['user'],
    });

    if (!bankAccount) {
      throw new ForbiddenException(
        'You do not have access to this bank account',
      );
    }

    const normalizedCategory = createTransactionDto.category
      .trim()
      .toLowerCase();
    let category = await this.categoryRepository.findOne({
      where: { name: normalizedCategory },
    });
    if (!category) {
      category = this.categoryRepository.create({
        name: normalizedCategory,
      });
      await this.categoryRepository.save(category);
    }

    if (createTransactionDto.type === TransactionType.WITHDRAWAL) {
      if (bankAccount.balance < createTransactionDto.amount) {
        throw new BadRequestException('Insufficient funds');
      }
      bankAccount.balance -= createTransactionDto.amount;
    } else if (createTransactionDto.type === TransactionType.DEPOSIT) {
      bankAccount.balance += createTransactionDto.amount;
    } else {
      throw new BadRequestException('Invalid transaction type');
    }

    const transaction = this.transactionRepository.create({
      type: createTransactionDto.type,
      amount: createTransactionDto.amount,
      bankAccount,
      category,
      description: `${createTransactionDto.type} of ${createTransactionDto.amount} in category ${createTransactionDto.category}`,
    });

    await this.bankAccountRepository.save(bankAccount);
    await this.transactionRepository.save(transaction);

    return plainToInstance(
      ResponseTransactionDto,
      {
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        performedAt: transaction.performed_at,
        categoryName: transaction.category.name,
        bankAccountNumber: transaction.bankAccount.number,
      },
      { excludeExtraneousValues: true },
    );
  }
}

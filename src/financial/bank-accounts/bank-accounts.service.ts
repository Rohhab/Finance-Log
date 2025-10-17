import { Injectable } from '@nestjs/common';
import { BankAccount } from './entities/bank-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
  ) {}
  async createBankAccount(): Promise<BankAccount> {
    const newAccount = this.bankAccountRepository.create({
      number: '1234567890',
      balance: 1000,
    });
    await this.bankAccountRepository.save(newAccount);
    return newAccount;
  }
}

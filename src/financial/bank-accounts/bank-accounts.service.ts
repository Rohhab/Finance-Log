import { BadRequestException, Injectable } from '@nestjs/common';
import { BankAccount } from './entities/bank-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBankAccountDto } from './dtos/create-bank-account.dto';
import { ResponseBankAccountDto } from './dtos/response-bank-account.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { User } from 'iam/users/entities/user.entity';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
  ) {}

  async getBankAccountById(id: number): Promise<ResponseBankAccountDto> {
    const bankAccount = await this.bankAccountRepository.findOneBy({ id });

    if (!bankAccount) {
      throw new BadRequestException('Bank account not found');
    }

    return plainToInstance(ResponseBankAccountDto, bankAccount, {
      excludeExtraneousValues: true,
    });
  }

  async getAllBankAccounts(): Promise<ResponseBankAccountDto[]> {
    const bankAccounts = await this.bankAccountRepository.find();

    return plainToInstance(ResponseBankAccountDto, bankAccounts, {
      excludeExtraneousValues: true,
    });
  }

  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    userId: number,
  ): Promise<ResponseBankAccountDto> {
    const { number, balance } = createBankAccountDto;

    if (await this.bankAccountRepository.findOneBy({ number })) {
      throw new BadRequestException(
        'Bank account with this number already exists',
      );
    }

    const newAccount = this.bankAccountRepository.create({
      number,
      balance,
      user: { id: userId } as User,
    });

    await this.bankAccountRepository.save(newAccount);

    return plainToInstance(ResponseBankAccountDto, newAccount, {
      excludeExtraneousValues: true,
    });
  }

  async updateBankAccount(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
    userId: number,
  ): Promise<ResponseBankAccountDto> {
    const { number, balance } = updateBankAccountDto;

    const bankAccount = await this.bankAccountRepository.findOneBy({ id });

    if (!bankAccount) {
      throw new BadRequestException('Bank account not found');
    }

    Object.assign(bankAccount, {
      number: number ?? bankAccount.number,
      balance: balance ?? bankAccount.balance,
      user: { id: userId } as User,
    });

    await this.bankAccountRepository.save(bankAccount);

    return plainToInstance(ResponseBankAccountDto, bankAccount, {
      excludeExtraneousValues: true,
    });
  }

  async deleteBankAccount(id: string): Promise<void> {
    await this.bankAccountRepository.delete(id);
  }
}

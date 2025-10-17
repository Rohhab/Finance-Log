import { BadRequestException, Injectable } from '@nestjs/common';
import { BankAccount } from './entities/bank-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBankAccountDto } from './dtos/create-bank-account.dto';
import { BankAccountResponseDto } from './dtos/bank-account-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
  ) {}

  async getBankAccountById(id: number): Promise<BankAccountResponseDto> {
    const bankAccount = await this.bankAccountRepository.findOneBy({ id });

    if (!bankAccount) {
      throw new BadRequestException('Bank account not found');
    }

    return plainToInstance(BankAccountResponseDto, bankAccount, {
      excludeExtraneousValues: true,
    });
  }

  async getAllBankAccounts(): Promise<BankAccountResponseDto[]> {
    const bankAccounts = await this.bankAccountRepository.find();

    return plainToInstance(BankAccountResponseDto, bankAccounts, {
      excludeExtraneousValues: true,
    });
  }

  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    const { number, balance } = createBankAccountDto;

    if (await this.bankAccountRepository.findOneBy({ number })) {
      throw new BadRequestException(
        'Bank account with this number already exists',
      );
    }

    const newAccount = this.bankAccountRepository.create({
      number,
      balance,
    });

    await this.bankAccountRepository.save(newAccount);

    return plainToInstance(BankAccountResponseDto, newAccount, {
      excludeExtraneousValues: true,
    });
  }

  async updateBankAccount(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    const bankAccount = await this.bankAccountRepository.findOneBy({ id });

    if (!bankAccount) {
      throw new BadRequestException('Bank account not found');
    }

    Object.assign(bankAccount, updateBankAccountDto);

    await this.bankAccountRepository.save(bankAccount);

    return plainToInstance(BankAccountResponseDto, bankAccount, {
      excludeExtraneousValues: true,
    });
  }

  async deleteBankAccount(id: string): Promise<void> {
    await this.bankAccountRepository.delete(id);
  }
}

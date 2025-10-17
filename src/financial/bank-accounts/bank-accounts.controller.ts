import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dtos/create-bank-account.dto';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { BankAccountResponseDto } from './dtos/bank-account-response.dto';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllBankAccounts(): Promise<BankAccountResponseDto[]> {
    return this.bankAccountService.getAllBankAccounts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneBankAccount(@Param('id') id: string): Promise<BankAccountResponseDto> {
    return this.bankAccountService.getBankAccountById(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    return this.bankAccountService.createBankAccount(createBankAccountDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateBankAccount(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    return this.bankAccountService.updateBankAccount(+id, updateBankAccountDto);
  }

  @Delete(':id')
  deleteBankAccount(@Param('id') id: string) {
    return this.bankAccountService.deleteBankAccount(id);
  }
}

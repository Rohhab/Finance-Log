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

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllBankAccounts() {
    return 'Hello Bank Account!';
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneBankAccount(@Param('id') id: string) {
    return Number(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBankAccount(@Body() body: any) {
    return this.bankAccountService.createBankAccount();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateBankAccount() {}

  @Delete()
  deleteBankAccount() {}
}

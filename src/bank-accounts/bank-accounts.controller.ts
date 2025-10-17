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

@Controller('bank-accounts')
export class BankAccountsController {
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
  createBankAccount() {}

  @Put()
  @HttpCode(HttpStatus.OK)
  updateBankAccount() {}

  @Delete()
  deleteBankAccount() {}
}

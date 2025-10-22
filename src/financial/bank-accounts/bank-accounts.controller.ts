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
  Req,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dtos/create-bank-account.dto';
import { UpdateBankAccountDto } from './dtos/update-bank-account.dto';
import { ResponseBankAccountDto } from './dtos/response-bank-account.dto';
import { JwtAuthGuard } from 'iam/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllBankAccounts(): Promise<ResponseBankAccountDto[]> {
    return this.bankAccountService.getAllBankAccounts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneBankAccount(@Param('id') id: string): Promise<ResponseBankAccountDto> {
    return this.bankAccountService.getBankAccountById(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @Req() req,
  ): Promise<ResponseBankAccountDto> {
    return this.bankAccountService.createBankAccount(
      createBankAccountDto,
      req.user.id,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateBankAccount(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @Req() req,
  ): Promise<ResponseBankAccountDto> {
    return this.bankAccountService.updateBankAccount(
      +id,
      updateBankAccountDto,
      req.user.id,
    );
  }

  @Delete(':id')
  deleteBankAccount(@Param('id') id: string) {
    return this.bankAccountService.deleteBankAccount(id);
  }
}

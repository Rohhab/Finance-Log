import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { JwtAuthGuard } from 'iam/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTransactions(): string {
    return 'This action returns all transactions';
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneTransaction(@Param('id') id: string): string {
    return 'This action returns transaction with id: ${id}';
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTransaction(): string {
    return 'This action creates a transaction';
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTransaction(): string {
    return 'This action updates a transaction';
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTransaction(): string {
    return 'This action deletes a transaction';
  }
}

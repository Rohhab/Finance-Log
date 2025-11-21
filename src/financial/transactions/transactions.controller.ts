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
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { JwtAuthGuard } from 'iam/auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ResponseTransactionDto } from './dtos/response-transaction.dto';

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
    return `This action returns transaction with id: ${id}`;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTransaction(
    @Req() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ResponseTransactionDto> {
    const user = req.user as AuthenticatedUser;
    return this.transactionsService.createTransaction(
      user.id,
      createTransactionDto,
    );
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Category } from './entities/category.entity';
import { TransactionService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category])],
  providers: [TransactionService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}

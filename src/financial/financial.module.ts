import { Module } from '@nestjs/common';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [BankAccountsModule, TransactionsModule],
})
export class FinancialModule {}

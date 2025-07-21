import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';

@Module({
  imports: [UsersModule, TransactionsModule, BankAccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

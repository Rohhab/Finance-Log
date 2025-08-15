import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './iam/users/entities/user.entity';
import { RefreshToken } from 'iam/auth/entities/refresh-token.entity';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    TransactionsModule,
    BankAccountsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'finance_user',
      password: 'userpass456',
      database: 'finance_log_db',
      entities: [User, RefreshToken],
      synchronize: true,
    }),
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

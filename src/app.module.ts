import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './iam/users/entities/user.entity';
import { RefreshToken } from 'iam/auth/entities/refresh-token.entity';
import { BankAccount } from './financial/bank-accounts/entities/bank-account.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FinancialModule } from './financial/financial.module';
import { Transaction } from 'financial/transactions/entities/transaction.entity';
import { Category } from 'financial/transactions/entities/category.entity';

@Module({
  imports: [
    IamModule,
    FinancialModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, RefreshToken, BankAccount, Transaction, Category],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { TransactionType } from 'common/enums/transaction-type.enum';

export class CreateTransactionDto {
  bankAccountId: number;
  category: string;
  amount: number;
  type: TransactionType;
}

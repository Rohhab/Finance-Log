import { Expose } from 'class-transformer';

export class ResponseTransactionDto {
  @Expose()
  type: string;

  @Expose()
  description: string;

  @Expose()
  amount: number;

  @Expose()
  performed_at: Date;

  @Expose()
  categoryName: string;

  @Expose()
  bankAccountNumber: string;
}

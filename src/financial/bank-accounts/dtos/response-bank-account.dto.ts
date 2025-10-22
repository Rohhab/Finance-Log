import { Expose } from 'class-transformer';

export class ResponseBankAccountDto {
  constructor(partial: Partial<ResponseBankAccountDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  number: string;

  @Expose()
  balance: number;

  @Expose()
  userId: number;
}

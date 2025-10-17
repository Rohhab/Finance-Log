import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class BankAccountResponseDto {
  constructor(partial: Partial<BankAccountResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  number: string;

  @Expose()
  balance: number;
}

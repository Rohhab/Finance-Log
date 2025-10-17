import { IsString } from 'class-validator';

export class UpdateBankAccountDto {
  @IsString()
  number: string;

  balance: number;
}

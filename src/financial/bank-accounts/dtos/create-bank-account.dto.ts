import { IsString } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  number: string;

  balance: number;
}

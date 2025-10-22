import { IsNumber, IsString, IsIBAN } from 'class-validator';

export class UpdateBankAccountDto {
  @IsIBAN()
  @IsString()
  number: string;

  @IsNumber()
  balance: number;
}

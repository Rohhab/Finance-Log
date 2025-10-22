import { IsIBAN, IsNumber, IsString } from 'class-validator';

export class CreateBankAccountDto {
  @IsIBAN()
  @IsString()
  number: string;

  @IsNumber()
  balance: number;
}

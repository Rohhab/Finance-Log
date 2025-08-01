import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

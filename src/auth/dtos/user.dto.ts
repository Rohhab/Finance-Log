import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

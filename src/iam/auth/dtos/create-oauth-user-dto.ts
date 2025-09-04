import { IsEmail, IsIn } from 'class-validator';
import { AuthProvider } from 'common/enums/auth-provider.enum';

export class CreateOAuthUserDto {
  constructor(partial: Partial<CreateOAuthUserDto>) {
    Object.assign(this, partial);
  }

  @IsEmail()
  username: string;

  @IsIn(Object.values(AuthProvider))
  provider: string;
}

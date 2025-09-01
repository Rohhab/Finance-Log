import { Expose } from 'class-transformer';

export class UserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: number;

  @Expose()
  username: string;
}

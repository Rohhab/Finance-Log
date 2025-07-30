import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from './dtos/user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: UserDto): Promise<User> {
    const user = await this.usersService.create(dto);
    return user;
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUsername(username);

    if (user?.password !== pass) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (user && passwordMatch) {
      const { password, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  async signIn(user: AuthenticatedUser): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.jwtService.verify(refreshToken); // Add your own verification logic

    const user = await this.usersService.findOneByUsername(payload.username);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const newAccess = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
    const newRefresh = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return {
      accessToken: newAccess,
      refreshToken: newRefresh,
    };
  }
}

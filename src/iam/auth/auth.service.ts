import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'iam/users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'iam/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserResponseDto } from 'iam/users/dtos/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Password is not correct.');
    }

    if (user && passwordMatch) {
      const { password, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userDto = await this.usersService.create(createUserDto);
    return userDto;
  }

  async signIn(
    user: AuthenticatedUser,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { access_token: newAccess } =
      await this.tokenService.generateAccessToken(user);
    const { refresh_token: newRefresh } =
      await this.tokenService.generateRefreshToken(user);

    await this.tokenService.saveInitialRefreshToken(newRefresh);

    return {
      access_token: newAccess,
      refresh_token: newRefresh,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
  }> {
    const { isTokenValid, refreshTokenInDb } =
      await this.tokenService.checkTokenInDb(refreshToken);

    if (isTokenValid && refreshTokenInDb) {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new BadRequestException('User not found.');
      }

      await this.tokenService.revokeToken(refreshToken, 'Refresh');

      const { access_token: newAccess } =
        await this.tokenService.generateAccessToken(user);
      const { refresh_token: newRefresh } =
        await this.tokenService.generateRefreshToken(user);
      const responseUser = new UserResponseDto(user);

      await this.tokenService.rotateRefreshToken(newRefresh);

      return {
        user: responseUser,
        accessToken: newAccess,
        refreshToken: newRefresh,
      };
    } else {
      throw new BadRequestException('Refresh token is not valid.');
    }
  }

  async signOut(user: AuthenticatedUser): Promise<void> {
    const userInDb = await this.usersService.findOneByUsername(user.username);

    if (!userInDb) {
      throw new BadRequestException('User not found.');
    }

    const aliveUserToken = await this.tokenService.findTokenForUser(userInDb);
    await this.tokenService.revokeToken(aliveUserToken.token, 'Manual');
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'iam/users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { UserResponseDto } from 'iam/users/dtos/user-response.dto';
import { CreateOAuthUserDto } from './dtos/create-oauth-user-dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async validateLocalUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      return null;
    }

    if (!user.password) {
      throw new UnauthorizedException('Password is missing for local user.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Password is not correct. Cannot validate the user',
      );
    }

    if (user && passwordMatch) {
      const { password, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }

  async resolveOAuthUser(
    createOAuthUserDto: CreateOAuthUserDto,
  ): Promise<UserResponseDto> {
    const localUser = await this.usersService.findOneByUsername(
      createOAuthUserDto.username,
    );

    if (localUser && localUser.provider !== createOAuthUserDto.provider) {
      /* TO DO: Introduce a mail service and send the user a notification of their user in our app may be compromised. */
    }

    if (localUser)
      return plainToInstance(UserResponseDto, localUser, {
        excludeExtraneousValues: true,
      });

    return await this.usersService.createOAuthUser(createOAuthUserDto);
  }

  async signUp(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userDto = await this.usersService.createLocalUser(createUserDto);
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
        throw new BadRequestException(
          'User not found. Cannot refresh the tokens.',
        );
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
      throw new BadRequestException(
        'Refresh token is not valid. Cannot refresh the tokens.',
      );
    }
  }

  async signOut(user: AuthenticatedUser): Promise<void> {
    const userInDb = await this.usersService.findOneByUsername(user.username);

    if (!userInDb) {
      throw new BadRequestException(
        'User not found. Cannot sign out the user.',
      );
    }

    const aliveUserToken = await this.tokenService.findTokenForUser(userInDb);
    await this.tokenService.revokeToken(aliveUserToken.token, 'Manual');
  }
}

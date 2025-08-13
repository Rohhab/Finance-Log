import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async generateAccessToken(
    user: AuthenticatedUser,
  ): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async generateRefreshToken(
    user: AuthenticatedUser,
  ): Promise<{ refresh_token: string }> {
    const payload = { sub: user.id };
    return {
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async checkTokenInDb(
    refreshToken: string,
  ): Promise<{ isTokenValid: boolean; refreshTokenInDb?: RefreshToken }> {
    const TokenInDb = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (!TokenInDb) {
      return { isTokenValid: false };
    }

    const now = new Date();
    return {
      isTokenValid:
        !TokenInDb.revoked && !TokenInDb.revokedAt && TokenInDb.expiresAt > now,
      refreshTokenInDb: TokenInDb,
    };
  }

  async saveToken(refreshToken: string): Promise<void> {
    const { isTokenValid, refreshTokenInDb } =
      await this.checkTokenInDb(refreshToken);

    if (!isTokenValid) {
      throw new BadRequestException(
        'Refresh token is either expired or invalid.',
      );
    }
    if (refreshTokenInDb) {
      throw new BadRequestException('Refresh token already stored.');
    }

    let payload;
    try {
      payload = await this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new BadRequestException(
        'Invalid or expired refresh token provided.',
      );
    }

    const userInDb = await this.usersService.findOne(payload.sub);
    if (!userInDb) {
      throw new BadRequestException('User not found.');
    }

    const tokenEntity = await this.refreshTokenRepository.create({
      token: refreshToken,
      revoked: false,
      expiresAt: new Date(payload.exp * 1000),
      revokedAt: null,
      user: userInDb,
    });

    await this.refreshTokenRepository.save(tokenEntity);
  }

  async revokeToken(refreshToken: string): Promise<void> {
    const { isTokenValid, refreshTokenInDb } =
      await this.checkTokenInDb(refreshToken);

    if (!isTokenValid) {
      throw new BadRequestException(
        'Refresh token is either expired or invalid.',
      );
    }
    if (!refreshTokenInDb) {
      throw new BadRequestException('Invalid refresh token provided.');
    }

    refreshTokenInDb.revoked = true;
    refreshTokenInDb.revokedAt = new Date();

    await this.refreshTokenRepository.save(refreshTokenInDb);
  }
}

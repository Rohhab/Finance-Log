import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'iam/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async checkTokenInDb(
    refreshToken: string,
  ): Promise<{ isTokenValid: boolean; refreshTokenInDb?: RefreshToken }> {
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (!existingToken) {
      throw new BadRequestException('');
    }

    const now = new Date();
    return {
      isTokenValid:
        !existingToken.revoked &&
        !existingToken.revokedAt &&
        existingToken.expiresAt > now,
      refreshTokenInDb: existingToken,
    };
  }

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
    const existingToken = await this.refreshTokenRepository.findOne({
      where: {
        revoked: false,
        user: { id: payload.sub },
      },
      relations: ['user'],
    });

    if (existingToken) {
      throw new ForbiddenException('User has an active session.');
    }

    return {
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async saveNewRefreshToken(refreshToken: string): Promise<void> {
    const payload = await this.jwtService.verify(refreshToken);
    const userInDb = await this.usersService.findOne(payload.sub);

    if (!userInDb) {
      throw new BadRequestException('User not found.');
    }

    if (payload.exp * 1000 < Date.now()) {
      await this.revokeToken(refreshToken, 'Expired');
      throw new BadRequestException('Refresh token has expired.');
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

  async revokeToken(
    refreshToken: string,
    reason: 'Expired' | 'Manual' | 'Compromised',
  ): Promise<void> {
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
    refreshTokenInDb.revocationReason = reason;
    refreshTokenInDb.revokedAt = new Date();

    await this.refreshTokenRepository.save(refreshTokenInDb);
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const refreshToken = request.cookies['refresh_token'];
      if (!refreshToken) {
        throw new UnauthorizedException(
          'No refresh token provided. Cannot refresh the tokens.',
        );
      }

      const {
        user,
        accessToken,
        refreshToken: newRefresh,
      } = await this.authService.refreshTokens(refreshToken);

      request.user = user;
      request.tokens = { accessToken, refreshToken: newRefresh };

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token is either expired or invalid. Cannot refresh the tokens.',
      );
    }
  }
}

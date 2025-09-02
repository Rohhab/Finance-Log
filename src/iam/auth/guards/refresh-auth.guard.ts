import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshAuthGuard extends AuthGuard() {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const refreshTokenInRequest = request.cookies['refresh_token'];
    const {
      user,
      accessToken: newAccess,
      refreshToken: newRefresh,
    } = await this.authService.refreshTokens(refreshTokenInRequest);

    response.cookie('refresh_token', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days in milliseconds
    });
    response.setHeader('Authorization', `Bearer: ${newAccess}`);

    request.user = user;
    return true;
  }
}

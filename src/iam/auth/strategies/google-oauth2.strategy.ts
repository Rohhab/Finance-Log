import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from 'common/enums/auth-provider.enum';
import { plainToInstance } from 'class-transformer';
import { CreateOAuthUserDto } from '../dtos/create-oauth-user-dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const googleClientId = configService.get<string>('GOOGLE_CLIENT_ID');
    if (!googleClientId) {
      throw new Error(
        'GOOGLE_CLIENT_ID is not defined in environment variables',
      );
    }

    const googleClientSecret = configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    );
    if (!googleClientSecret) {
      throw new Error(
        'GOOGLE_CLIENT_SECRET is not defined in environment variables',
      );
    }

    const googleClientcallback = configService.get<string>(
      'GOOGLE_CLIENT_CALLBACK',
    );
    if (!googleClientcallback) {
      throw new Error(
        'GOOGLE_CLIENT_CALLBACK is not defined in environment variables',
      );
    }

    super({
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleClientcallback,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    rereshToken: string,
    profile: any,
  ): Promise<any> {
    const username = profile.emails[0].value;
    const provider = AuthProvider.GOOGLE;

    const oAuthUserdto = plainToInstance(CreateOAuthUserDto, {
      username,
      provider,
    });

    const user = await this.authService.resolveOAuthUser(oAuthUserdto);

    return user;
  }
}

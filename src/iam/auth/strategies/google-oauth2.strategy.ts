import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

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
    const user = { userName: profile.emails[0].value };
    return user;
  }
}

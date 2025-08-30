import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID:
        '825724090858-a6hreemdvtpi0mab4rdj3sl4dkt8clfn.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://localhost:3000/api/auth/google/callback',
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
    console.log(user);
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

//This strategy should get related to Google-OAuth2.0
import { Strategy } from 'passport-local';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  validate(...args: any[]): unknown {
    throw new Error('Method not implemented.');
  }
}

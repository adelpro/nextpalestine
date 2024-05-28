import { AuthenticatedUser } from '../types/authenticatedUser.type';
import { Fingerprint } from '../decorators/fingerprint.decorator';
import { Profile, Strategy } from 'passport-google-oauth20';
import { FingerprintObj } from '../types/fingerprint.type';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CLIENT_CALLBACK'),
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'select_account',
    });
  }
  authorizationParams(options: any): object {
    return Object.assign(options, { prompt: 'select_account' });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<AuthenticatedUser> {
    const payload: AuthenticatedUser = await this.authService.signinSocial(
      {
        name: profile.name?.givenName || '',
        email: profile.emails?.[0]?.value || '',
      },
      fingerprint,
    );
    return payload;
  }
}

import { AuthenticatedUser } from '../types/authenticatedUser.type';
import { Fingerprint } from '../decorators/fingerprint.decorator';
import { FingerprintObj } from '../types/fingerprint.type';
import { Profile, Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CLIENT_CALLBACK'),
      profileFields: ['id', 'name', 'email'],
      scope: ['email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<AuthenticatedUser> {
    const payload = await this.authService.signinSocial(
      {
        name: profile.name?.givenName || '',
        email: profile.emails?.[0]?.value || '',
      },
      fingerprint,
    );
    return payload || null;
  }
}

import { AuthenticatedUser } from '../types/authenticatedUser.type';
import { FingerprintObj } from '../types/fingerprint.type';
import { Profile, Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../decorators/fingerprint.decorator';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    readonly configService: ConfigService,
    readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CLIENT_CALLBACK'),
      scope: ['user:email'],
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
        name: profile.username || '',
        email: profile.emails?.[0]?.value || '',
      },
      fingerprint,
    );
    return payload || null;
  }
}

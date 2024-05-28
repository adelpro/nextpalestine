import { TokensService } from '../../tokens/tokens.service';
import { UsersService } from '../../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly userService: UsersService,
    readonly tokenService: TokensService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const token: string = req?.cookies['token'];
          if (!token) {
            return null;
          }

          const foundToken = tokenService.findTokenByValue(token);
          if (!foundToken) {
            return null;
          }
          return token;
        },
      ]),
      secretOrKey: configService.get<string>('COOKIE_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    return { ...payload, token: req.cookies['token'] };
  }
}

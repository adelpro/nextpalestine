import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { TrustedDevicesService } from '@/trusted-devices/trusted-devices.service';
import { AuthenticatedUser } from './types/authenticatedUser.type';
import { UserDocument } from '../users/schemas/user.schema';
import { FingerprintObj } from './types/fingerprint.type';
import { SocialSigninDTO } from './dtos/socialSignin.dto';
import { MailerService } from '../mailer/mailer.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { SignupUserDTO } from './dtos/signupUser.dto';
import { signinUserDTO } from './dtos/signinUser.dto';
import * as generatePassword from 'generate-password';
import { argonConfig } from '../config/argon.config';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import * as argon2 from 'argon2';
import { TokenPayload } from '@/tokens/types/TokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokensService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private trustedDeviceService: TrustedDevicesService,
    private configService: ConfigService,
  ) {}

  getCookieOptions(): CookieOptions {
    const ttl = this.configService.get<number>('COOKIE_JWT_TTL_MS');
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ttl,
    };
  }
  async signinLocal(signinUser: signinUserDTO, fingerprint: FingerprintObj): Promise<AuthenticatedUser> {
    const { email, password } = signinUser.user;
    const user = await this.userService.getUserByEmail(email, '+password');

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isValidPassword = await argon2.verify(user.password, password, argonConfig);
    if (!isValidPassword) {
      // Invalid credentials
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateAndSaveToken(user, fingerprint);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActivated: !!user.isActivated,
      isTwoFAEnabled: !!user.isTwoFAEnabled,
      token,
    };
  }

  async signupLocal(SignupUser: SignupUserDTO, fingerprint: FingerprintObj): Promise<AuthenticatedUser> {
    const { email, password, name } = SignupUser.user;
    const founduser = await this.userService.getUserByEmail(email, '+password');
    if (founduser) {
      throw new ConflictException(`User with email ${founduser.email} already exists`);
    }
    const user = await this.userService.create({
      email,
      password,
      name,
    });
    if (!user.isActivated) {
      throw new ForbiddenException('Account not activated yet');
    }
    if (!user.isTwoFAEnabled) {
      throw new UnauthorizedException('Redirect to 2FA page');
    }
    const token = await this.generateAndSaveToken(user, fingerprint);
    await this.userService.update(user.id, { token: token });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActivated: user.isActivated,
      token,
    };
  }

  async signout(id: string, token: string): Promise<string> {
    await this.tokenService.deleteTokenByValue(token);
    return id.toString();
  }
  async signinSocial(signinUser: SocialSigninDTO, fingerprint: FingerprintObj): Promise<AuthenticatedUser> {
    const { email, name } = signinUser;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      const password = this.generatePass();
      this.mailerService.sendRegistrationEmail(email, name, password);
      const userToRegister = {
        name,
        email,
        password,
      };
      const newUser = await this.userService.create(userToRegister);
      const token = await this.generateAndSaveToken(newUser, fingerprint);
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token,
      };
    }
    const token = await this.generateAndSaveToken(user, fingerprint);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  }
  /**
   * This is a function generate a token to be used with cookies.
   *
   * The validity of generated token will be extracted from the 'COOKIE_JWT_TTL_MS'.
   * @param {UserDocument} user The user.
   * @param {FingerprintObj} fingerprint The fingerprint.
   * @returns {string} The generated token.
   */

  async generateToken(user: UserDocument, fingerprint: FingerprintObj): Promise<string> {
    const isDeviceTrusted: boolean = await this.trustedDeviceService.isDeviceTrusted(user.id, fingerprint);
    const TSecretKey = this.configService.get<string>('COOKIE_JWT_SECRET');
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      isActivated: user.isActivated || false,
      isTwoFAEnabled: user.isTwoFAEnabled || false,
      isDeviceTrusted,
    };
    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: TSecretKey,
      expiresIn: this.configService.get<number>('COOKIE_JWT_TTL_MS'),
    });
    return token;
  }
  async generateAndSaveToken(user: UserDocument, fingerprint: FingerprintObj): Promise<string> {
    const token = await this.generateToken(user, fingerprint);
    await this.tokenService.updateTokenByFingerprint(user.id, fingerprint, token);
    // const newPass = this.generatePass();
    return token;
  }

  /**
   * This is a function generate a rundom password using the generate-password library
   *
   * The generated password will be 8 characters long, containing numbers, symbols ,uppercase and no similar characters.
   * @returns {string} The generated password.
   */
  generatePass(): string {
    const password = generatePassword.generate({
      length: 8,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
      exclude: '\'"',
    });
    return password;
  }
}

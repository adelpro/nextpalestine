import { Body, Controller, HttpStatus, Post, Res, UseGuards, HttpCode, Get } from '@nestjs/common';
import { AuthenticatedUserResponseDTO } from './dtos/authenticatedUserResponse.dto';
import { AuthenticatedUserResponse } from './types/authenticatedUserResponse.type';
import { TrustedDevicesService } from '@/trusted-devices/trusted-devices.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedUser } from './types/authenticatedUser.type';
import { CurrentUser } from './decorators/currentUser.decorator';
import { Fingerprint } from './decorators/fingerprint.decorator';
import { ErrorResponseDTO } from './dtos/errorResponse.sto';
import { FacebookAuthGuard } from './guards/facebook.guard';
import { FingerprintObj } from './types/fingerprint.type';
import { TokensService } from '../tokens/tokens.service';
import { GithubAuthGuard } from './guards/github.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { signinUserDTO } from './dtos/signinUser.dto';
import { SignupUserDTO } from './dtos/signupUser.dto';
import { Roles } from './decorators/roles.decorator';
import { JWTAuthGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/roles.guard';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService,
    readonly tokenService: TokensService,
    readonly trustedDeviceService: TrustedDevicesService,
    readonly configService: ConfigService,
  ) {}

  @Post('local/signin')
  @ApiOperation({ summary: 'Local signin' })
  @ApiBody({ type: signinUserDTO })
  @ApiResponse({
    status: 200,
    description: 'Sign-in successful',
    type: AuthenticatedUserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDTO,
  })
  @ApiResponse({
    status: 403,
    description: 'Account not activated',
    type: ErrorResponseDTO,
  })
  async signinLocal(
    @Res() response: Response,
    @Body() signinUser: signinUserDTO,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<Response<AuthenticatedUserResponse | ErrorResponseDTO>> {
    const payload = await this.authService.signinLocal(signinUser, fingerprint);
    const { id, name, isActivated, isTwoFAEnabled, token } = payload;
    const { email } = signinUser.user;
    if (!isActivated) {
      return response.cookie('token', token, this.authService.getCookieOptions()).status(HttpStatus.FORBIDDEN).json({
        statusCode: 403,
        message: 'Account not activated yet',
        error: 'Forbiden',
      });
    }
    const isDeviceTrusted: boolean = await this.trustedDeviceService.isDeviceTrusted(id, fingerprint);
    if (isTwoFAEnabled && !isDeviceTrusted) {
      return response.cookie('token', token, this.authService.getCookieOptions()).status(430).json({
        statusCode: 430,
        message: '2FA verification required',
        error: '2FA',
      });
    }

    const signedinUserResponse: AuthenticatedUserResponse = {
      provider: 'local',
      id,
      name,
      email,
      isActivated,
      isTwoFAEnabled,
    };
    return response
      .cookie('token', token, this.authService.getCookieOptions())
      .status(HttpStatus.OK)
      .json(signedinUserResponse);
  }

  @Post('local/signup')
  @ApiOperation({ summary: 'Local signup' })
  @ApiBody({ type: SignupUserDTO })
  @ApiResponse({
    status: 201,
    description: 'New user created',
    type: AuthenticatedUserResponseDTO,
  })
  @ApiResponse({
    status: 409,
    description: 'User with email ${email} already exists',
    type: ErrorResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDTO,
  })
  @ApiResponse({
    status: 403,
    description: 'Account not activated',
    type: ErrorResponseDTO,
  })
  async signupLocal(
    @Res() response: Response,
    @Body() signupUser: SignupUserDTO,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<Response<AuthenticatedUserResponse | ErrorResponseDTO>> {
    const { email, name } = signupUser.user;
    const payload = await this.authService.signupLocal(signupUser, fingerprint);
    const { id, isActivated, isTwoFAEnabled, token, role } = payload;
    const signedinUserResponse: AuthenticatedUserResponse = {
      provider: 'local',
      id,
      name,
      email,
      role,
      isActivated,
      isTwoFAEnabled,
    };
    return response
      .cookie('token', token, this.authService.getCookieOptions())
      .status(HttpStatus.CREATED)
      .json(signedinUserResponse);
  }

  // Skip throttle
  // @SkipThrottle()
  @UseGuards(JWTAuthGuard)
  @Get('signout')
  @ApiOperation({ summary: 'Signout user' })
  @ApiResponse({
    status: 200,
    description: 'Succesfully Signed out',
  })
  @HttpCode(HttpStatus.OK)
  async Signout(
    @Res() response: Response,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Response<{ id: string; message: string }>> {
    await this.authService.signout(user.id, user.token);
    return response.clearCookie('token').status(HttpStatus.OK).json({ id: user.id, message: 'Succesfully signed out' });
  }

  // Overwrite the default throttle value
  @Throttle(60, 3)
  @Roles('user')
  @UseGuards(JWTAuthGuard, RoleGuard)
  @Get('protected')
  @ApiOperation({
    summary: 'Protected route, only autheticated user with role:user can access this route',
  })
  @HttpCode(HttpStatus.OK)
  protectedLocal(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Fingerprint() fingerprint: string,
  ): {
    id: string;
    email: string;
    name: string;
    role: string;
    fingerprint: string;
    message: string;
  } {
    const { id, email, name, role = 'user' } = currentUser;
    return {
      id: id.toString(),
      email,
      name,
      role,
      fingerprint,
      message: `Welcome ${name} You Are on a protected route`,
    };
  }

  @Get('google/signin')
  @ApiOperation({
    summary:
      'Social signin, if no user found a new user will be created, and the generated email will be sent to the user user',
  })
  @UseGuards(GoogleAuthGuard)
  async googleSignin(@Res() res: Response) {
    return res.redirect('/auth/google/callback');
  }

  @Get('google/callback')
  @ApiOperation({
    summary:
      'Social signin callback, if no user found a new user will be created, and the generated email will be sent to the user user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success, Social signin/up successfully',
  })
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Fingerprint() fingerprint: FingerprintObj,
    @Res() response: Response,
  ): Promise<void> {
    const { id, token } = currentUser;
    await this.tokenService.updateTokenByFingerprint(id, fingerprint, token);
    return response
      .cookie('token', token, this.authService.getCookieOptions())

      .status(HttpStatus.ACCEPTED)
      .redirect(`${this.configService.get<string>('WEBSITE')}/success?title=Authentication with Google Successful!`);
  }

  @Get('github/signin')
  @ApiOperation({
    summary:
      'Social signin, if no user found a new user will be created, and the generated email will be sent to the user user',
  })
  @UseGuards(GithubAuthGuard)
  async githubSignin() {
    return HttpStatus.OK;
  }

  @Get('github/callback')
  @ApiOperation({
    summary:
      'Social signin callback, if no user found a new user will be created, and the generated email will be sent to the user user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success, Social signin/up successfully',
  })
  @UseGuards(GithubAuthGuard)
  async githubCallback(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<void> {
    const { id, token } = currentUser;
    await this.tokenService.updateTokenByFingerprint(id, fingerprint, token);

    return response
      .cookie('token', token, this.authService.getCookieOptions())
      .status(HttpStatus.ACCEPTED)
      .redirect(`${this.configService.get<string>('WEBSITE')}/success?title=Authentication with Github Successful!`);
  }

  @Get('facebook/signin')
  @ApiOperation({
    summary:
      'Social signin, if no user found a new user will be created, and the generated email will be sent to the user user',
  })
  @UseGuards(FacebookAuthGuard)
  async facebookSignin() {
    return HttpStatus.OK;
  }

  @Get('facebook/callback')
  @ApiOperation({
    summary:
      'Social signin callback, if no user found a new user will be created, and the generated email will be sent to the user user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success, Social signin/up successfully',
  })
  @UseGuards(FacebookAuthGuard)
  async facebookCallback(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<void> {
    const { id, token } = currentUser;
    await this.tokenService.updateTokenByFingerprint(id, fingerprint, token);

    return response
      .cookie('token', token, this.authService.getCookieOptions())
      .status(HttpStatus.ACCEPTED)
      .redirect(`${this.configService.get<string>('WEBSITE')}/success?title=Authentication with Facebook Successful!`);
  }
}

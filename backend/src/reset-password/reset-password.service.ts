import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResetPasswordService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const decodeToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('TEMP_JWT_SECRET'),
      });
      if (!decodeToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      await this.userService.update(decodeToken.id, {
        password,
      });
      return { message: 'Password updated successfully' };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

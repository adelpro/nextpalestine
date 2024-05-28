import { TrustedDevicesModule } from '@/trusted-devices/trusted-devices.module';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.stratigy';
import { GithubStrategy } from './strategies/gihtub.strategy';
import { MailerService } from '../mailer/mailer.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule.register({}), UsersModule, TokensModule, TrustedDevicesModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy, FacebookStrategy, MailerService],
  exports: [AuthService],
})
export class AuthModule {}

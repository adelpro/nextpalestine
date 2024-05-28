import { TrustedDevicesModule } from '@/trusted-devices/trusted-devices.module';
import { twoFAController } from './two-fa.controller';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { TwoFAService } from './two-fa.service';
import { Module } from '@nestjs/common';
import { MailerService } from '@/mailer/mailer.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, AuthModule, TrustedDevicesModule, JwtModule.register({})],
  providers: [TwoFAService, MailerService],
  controllers: [twoFAController],
})
export class TwoFAModule {}

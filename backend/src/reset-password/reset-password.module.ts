import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { MailerService } from '@/mailer/mailer.service';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [ResetPasswordController],
  providers: [MailerService, ResetPasswordService],
})
export class ResetPasswordModule {}

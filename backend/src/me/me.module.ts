import { TrustedDevicesModule } from '@/trusted-devices/trusted-devices.module';
import { MailerService } from '@/mailer/mailer.service';
import { UsersModule } from '@/users/users.module';
import { PostsModule } from '@/posts/posts.module';
import { AuthModule } from '@/auth/auth.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UsersModule, AuthModule, PostsModule, TrustedDevicesModule],
  controllers: [MeController],
  providers: [MeService, MailerService],
})
export class MeModule {}

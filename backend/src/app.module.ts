import { TrustedDevicesModule } from './trusted-devices/trusted-devices.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { envValidate } from './config/env/env.validate';
import { MulterModule } from '@nestjs/platform-express';
import { TokensModule } from './tokens/tokens.module';
import { TwoFAModule } from './two-fa/two-fa.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

//---------------------------------------------------------------
// NODE_ENV Must be set in package.json scripts
// Because its used before ConfigModule is initialized
// "start:dev": "cross-env NODE_ENV=development nest start --watch",
// "start:debug": "cross-env NODE_ENV=debug nest start --debug --watch",
// "start:prod": "cross-env NODE_ENV=production node dist/main",
//---------------------------------------------------------------

const NODE_ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${NODE_ENV}`, '.env'],
      validate: (config: Record<string, unknown>) => envValidate(config),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.getOrThrow<string>('MONGODB_URI')}`,
        //uri: `mongo://${configService.getOrThrow<string>('MONGO_INITDB_ROOT_USERNAME')}:${configService.getOrThrow<string>('MONGO_INITDB_ROOT_PASSWORD')}@localhost:27017/${configService.getOrThrow<string>('MONGO_DATABASE_NAME')}`,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        extensions: ['png'],
        index: false,
        maxAge: '1y',
        cacheControl: true,
      },

      serveRoot: '/public/',
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
    MulterModule.register(),
    AuthModule,
    UsersModule,
    PassportModule.register({ session: true }),
    TokensModule,
    MeModule,
    TwoFAModule,
    TrustedDevicesModule,
    PostsModule,
    ResetPasswordModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

import { Token, TokenSchema } from './schemas/token.schema';
import { TokensController } from './tokens.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from './tokens.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  providers: [TokensService],
  exports: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}

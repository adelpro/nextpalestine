import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { argonConfig } from '@/config/argon.config';
import { User } from '@/users/schemas/user.schema';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import * as argon2 from 'argon2';

export type TokenDocument = mongoose.HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  @Type(() => User)
  user: User;

  @Prop({
    type: Object,
    required: true,
  })
  fingerprint: FingerprintObj;

  @Prop({
    type: String,
    required: true,
  })
  token: string;
}
export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.pre<TokenDocument>('save', async function (next) {
  try {
    // Hashing the token
    // check if it is modified
    if (this.isModified('token')) {
      const hashedtoken = await argon2.hash(this.token, argonConfig);
      this.token = hashedtoken;
    }
    next();
  } catch (error) {
    next(error);
  }
});

TokenSchema.pre<mongoose.Query<Token, TokenDocument>>('findOneAndUpdate', async function (next) {
  try {
    const token: any = this.getUpdate();
    if (!token) {
      return next();
    }
    if (token.token) {
      const hashedToken = await argon2.hash(token.token, argonConfig);
      this.set('token', hashedToken);
    }
    next();
  } catch (error) {
    next(error);
  }
});

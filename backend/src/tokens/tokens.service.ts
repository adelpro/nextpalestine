import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { Token, TokenDocument } from './schemas/token.schema';
import { argonConfig } from '@/config/argon.config';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import * as argon2d from 'argon2';
import { Model } from 'mongoose';
@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}
  async updateTokenByFingerprint(
    user: string,
    fingerprint: FingerprintObj,
    token: string,
  ): Promise<TokenDocument | null> {
    const foundtoken = await this.tokenModel
      .findOneAndUpdate({ user, fingerprint }, { fingerprint, token }, { new: true, upsert: true })
      .exec();

    return foundtoken;
  }
  async deleteTokenByFingerprint(id: string, fingerprint: FingerprintObj) {
    const deletedToken = await this.tokenModel.findOneAndDelete({ user: id, fingerprint }).exec();
    return deletedToken;
  }
  async findTokenByValue(token: string): Promise<TokenDocument | null> {
    const hashedToken = await argon2d.hash(token, argonConfig);
    const foundToken = await this.tokenModel.findOne({ token: hashedToken }).exec();
    return foundToken;
  }

  async deleteTokenByValue(token: string): Promise<void> {
    const hashedToken = await argon2d.hash(token, argonConfig);
    await this.tokenModel.findOneAndDelete({ token: hashedToken }).exec();
  }
  async getTokenByFingerprint(id: string, fingerprint: FingerprintObj): Promise<string | null> {
    const record = await this.tokenModel.findOne({ user: id, fingerprint }).exec();
    return record?.token || null;
  }
  async getTokensByUserId(userId: string): Promise<Token[]> {
    const tokens = await this.tokenModel
      .find({ user: userId }, { _id: 0, id: '$_id', label: '$fingerprint.label' })
      .lean()
      .exec();
    return tokens;
  }

  async deleteTokenById(id: string): Promise<Token | null> {
    const token = await this.tokenModel.findOneAndDelete({ _id: id }).lean().exec();
    return token;
  }
}

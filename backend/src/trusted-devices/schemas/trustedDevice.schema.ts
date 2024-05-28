import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/users/schemas/user.schema';
import { Type } from 'class-transformer';
import * as mongoose from 'mongoose';

export type TrustedDeviceDocument = mongoose.HydratedDocument<TrustedDevice>;

@Schema()
export class TrustedDevice {
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
    expires: '90d',
  })
  fingerprint: FingerprintObj;
}
export const TrustedDeviceSchema = SchemaFactory.createForClass(TrustedDevice);

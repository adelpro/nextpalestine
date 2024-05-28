import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/users/schemas/user.schema';
import { Type } from 'class-transformer';

// Using POST not post to differenciate from '@nestjs/common' post decorator
export type POSTDocument = HydratedDocument<POST>;

@Schema()
export class POST {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  @Type(() => User)
  user: User;

  @Prop({
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
  })
  title: string;
  @Prop({
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
  })
  excerpt: string;

  @Prop({
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10000,
  })
  content: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  publishedAt: Date;
  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
  @Prop({
    type: Boolean,
    default: false,
  })
  isPublished: boolean;
}

export const POSTSchema = SchemaFactory.createForClass(POST);

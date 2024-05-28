import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { argonConfig } from '@/config/argon.config';
import { HydratedDocument, Query } from 'mongoose';
import { Role } from '@/auth/types/roles.type';
import * as argon2 from 'argon2';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    lowercase: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email address!`,
    },
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
    validate: {
      validator: (value: string) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
      },
      message:
        'Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number',
    },
  })
  password: string;

  @Prop({ type: String, default: 'user' })
  role?: Role;

  @Prop({ type: [String] })
  subscribers?: string[];

  @Prop({ type: String })
  profilePicture?: string;

  @Prop({ type: String })
  coverImage?: string;

  @Prop({ type: String, dafault: '', minlength: 10, maxlength: 500 })
  about?: string;

  @Prop({ type: [String] })
  socialLinks?: string[];

  @Prop({ type: String, select: false })
  token: string;

  @Prop({ type: Boolean, default: false })
  isActivated?: boolean;

  @Prop({ type: Boolean, default: false })
  isTwoFAEnabled?: boolean;

  @Prop({ type: String || null, default: null })
  twoFASecrect?: string | null;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const hashedPassword = await argon2.hash(this.password, argonConfig);
      this.password = hashedPassword;
    }

    if (this.isModified('token')) {
      const hashedToken = await argon2.hash(this.token, argonConfig);
      this.token = hashedToken;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre<Query<User, UserDocument>>('findOneAndUpdate', async function (next) {
  try {
    const user: any = this.getUpdate();
    if (!user) {
      return next();
    }
    if (user.password) {
      const hashedPassword = await argon2.hash(user.password, argonConfig);
      this.set('password', hashedPassword);
    }
    if (user.token) {
      const hashedToken = await argon2.hash(user.token, argonConfig);
      this.set('token', hashedToken);
    }
    next();
  } catch (error) {
    next(error);
  }
});

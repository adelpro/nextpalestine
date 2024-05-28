import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Omit<User, '_id' | 'createdAt' | 'token'>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUserById(id: string, selectFields = ''): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select(selectFields).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string, selectFields = ''): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).select(selectFields).exec();
    return user;
  }

  async update(id: string, user: Partial<User>): Promise<UserDocument | null> {
    let newUser: Partial<User> = user;
    const foundUser = await this.userModel.findById(id).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    // Make isActivated false when only the user email change
    if (user?.email && foundUser?.email !== user?.email) {
      newUser = { ...user, isActivated: false };
    }
    const updateUser = await this.userModel.findByIdAndUpdate(id, newUser, { new: true });
    return updateUser;
  }

  delete(id: ObjectId): Promise<User | null> {
    const deleteUser = this.userModel.findByIdAndRemove(id);
    if (!deleteUser) {
      throw new NotFoundException('User not found');
    }
    return deleteUser;
  }
  async activate(id: string, user: Partial<User>): Promise<UserDocument | null> {
    const newUser: Partial<User> = user;
    const foundUser = await this.userModel.findById(id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, newUser, { new: true });
    return updatedUser;
  }
}

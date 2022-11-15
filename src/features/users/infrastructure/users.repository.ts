import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDBType } from '../types/users.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<UserDBType>,
  ) {}

  async createUser(newUserTypeDb: Omit<UserDBType, '_id'>): Promise<ObjectId> {
    const newUser = await this.userModel.create(newUserTypeDb);
    return newUser._id;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: userId });
    return result.deletedCount > 0;
  }

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    return user;
  }

  async updateUser(user) {
    await user.save();
  }
}

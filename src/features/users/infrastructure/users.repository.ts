import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDBType } from '../types/users.types';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<UserDBType>,
  ) {}

  async createUser(newUserTypeDb: UserDBType) {
    await this.userModel.create(newUserTypeDb);
  }
}

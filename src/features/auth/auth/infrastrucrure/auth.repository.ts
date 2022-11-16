import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RefreshTokenDBType } from '../../refresh-token/types/refresh-token.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthRepository {
  constructor(
    // @Inject('USER_MODEL') private readonly userModel: Model<UserDBType>,
    @Inject('REFRESH_TOKEN_MODEL')
    private readonly refreshTokenModel: Model<RefreshTokenDBType>,
  ) {}

  async saveDeviceInputInDB(
    newInput: Omit<RefreshTokenDBType, '_id'>,
  ): Promise<ObjectId> {
    const result = await this.refreshTokenModel.create(newInput);
    return result._id;
  }
}

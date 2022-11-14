import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  UserDBType,
  ViewUsersTypeWithPagination,
  ViewUserType,
} from '../types/users.types';
import { QueryUserDto } from './models/query-user.dto';
import { mapUserDBTypeToViewType } from '../helpers/mapUserDBTypeToViewType';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<UserDBType>,
  ) {}

  async getUserById(userId: string): Promise<ViewUserType | null> {
    const userDBType = await this.userModel.findById(userId);
    if (!userDBType) return null;
    return mapUserDBTypeToViewType(userDBType);
  }

  async getUsers(query: QueryUserDto): Promise<ViewUsersTypeWithPagination> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';
    const searchLoginTerm: string | null = query.searchLoginTerm || null;
    const searchEmailTerm: string | null = query.searchEmailTerm || null;

    let itemsDBType: UserDBType[];
    let pagesCount: number;
    let totalCount: number;

    if (!searchEmailTerm && !searchLoginTerm) {
      itemsDBType = await this.userModel
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({});
      pagesCount = Math.ceil(totalCount / pageSize);
    }

    if (searchEmailTerm && !searchLoginTerm) {
      itemsDBType = await this.userModel
        .find({ email: { $regex: searchEmailTerm, $options: 'i' } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({
        email: { $regex: searchEmailTerm, $options: 'i' },
      });
      pagesCount = Math.ceil(totalCount / pageSize);
    }

    if (!searchEmailTerm && searchLoginTerm) {
      itemsDBType = await this.userModel
        .find({
          login: { $regex: searchLoginTerm, $options: 'i' },
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({
        login: { $regex: searchLoginTerm, $options: 'i' },
      });
      pagesCount = Math.ceil(totalCount / pageSize);
    }

    if (searchEmailTerm && searchLoginTerm) {
      itemsDBType = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } },
        ],
      });
      pagesCount = Math.ceil(totalCount / pageSize);
    }

    const items = itemsDBType.map((i) => mapUserDBTypeToViewType(i));

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }
}

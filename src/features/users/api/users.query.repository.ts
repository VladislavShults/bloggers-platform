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
    return {
      id: userDBType._id.toString(),
      login: userDBType.accountData.userName,
      email: userDBType.accountData.email,
      createdAt: userDBType.accountData.createdAt,
    };
  }

  async getUsers(query: QueryUserDto): Promise<ViewUsersTypeWithPagination> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'accountData.createdAt';
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
        .find({ 'accountData.email': { $regex: searchEmailTerm } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({
        'accountData.email': { $regex: searchEmailTerm },
      });
      pagesCount = Math.ceil(totalCount / pageSize);
    }

    if (!searchEmailTerm && searchLoginTerm) {
      itemsDBType = await this.userModel
        .find({ 'accountData.userName': { $regex: searchLoginTerm } })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({
        'accountData.userName': { $regex: searchLoginTerm },
      });
      pagesCount = Math.ceil(totalCount / pageSize);
    }

    if (searchEmailTerm && searchLoginTerm) {
      itemsDBType = await this.userModel
        .find({
          'accountData.login': { $regex: searchLoginTerm },
          'accountData.email': { $regex: searchEmailTerm },
        })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();

      totalCount = await this.userModel.count({
        'accountData.login': { $regex: searchLoginTerm },
        'accountData.email': { $regex: searchEmailTerm },
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

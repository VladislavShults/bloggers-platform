import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  //   async getUsers(
  //     pageNumber: number,
  //     pageSize: number,
  //   ): Promise<ViewUsersTypeWithPagination> {
  //     const item = await UserModel.find({})
  //       .select({
  //         _id: true,
  //         'accountData.userName': true,
  //         'accountData.email': true,
  //         'accountData.createdAt': true,
  //       })
  //       .skip((pageNumber - 1) * pageSize)
  //       .limit(+pageSize)
  //       .lean();
  //     const items: UserType[] = item.map((i) => ({
  //       id: i._id.toString(),
  //       login: i.accountData.userName,
  //       email: i.accountData.email,
  //       createdAt: i.accountData.createdAt,
  //     }));
  //     return {
  //       pagesCount: Math.ceil((await UserModel.count({})) / pageSize),
  //       page: pageNumber,
  //       pageSize: pageSize,
  //       totalCount: await UserModel.count({}),
  //       items,
  //     };
  //   }
  //
  //   async createUser(newUser: UserType, hash: string): Promise<UserType> {
  //     const newUserTypeDb = {
  //       _id: newUser.id,
  //       accountData: {
  //         userName: newUser.login,
  //         email: newUser.email,
  //         passwordHash: hash,
  //         createdAt: newUser.createdAt,
  //       },
  //       emailConfirmation: {
  //         confirmationCode: uuidv4(),
  //         expirationDate: add(new Date(), { hours: 5 }),
  //         isConfirmed: false,
  //       },
  //     };
  //     await UserModel.insertMany(newUserTypeDb);
  //     return newUser;
  //   }
  //
  //   async deleteUserById(id: string): Promise<boolean> {
  //     const result = await UserModel.deleteOne({ _id: id });
  //     return result.deletedCount === 1;
  //   }
  //
  //   async findByLogin(login: string): Promise<UserDBType | null> {
  //     return UserModel.findOne({ 'accountData.userName': login });
  //   }
  //
  //   async findUserByLogin(login: string): Promise<boolean> {
  //     const needLogin = await UserModel.count({ 'accountData.userName': login });
  //     return needLogin > 0;
  //   }
  //
  //   async findUserById(id: ObjectId): Promise<UserDBType | null> {
  //     return UserModel.findOne({ _id: id });
  //   }
  //
  //   async findUserByEmail(email: string): Promise<UserDBType | null> {
  //     return UserModel.findOne({ 'accountData.email': email });
  //   }
  //
  //   async refreshConfirmationCode(email: string): Promise<string | null> {
  //     const user = await UserModel.findOne({ 'accountData.email': email });
  //     if (!user) return null;
  //     await UserModel.updateOne(
  //       { 'accountData.email': email },
  //       {
  //         $set: {
  //           'emailConfirmation.confirmationCode': uuidv4(),
  //           'emailConfirmation.expirationDate': add(new Date(), { hours: 5 }),
  //         },
  //       },
  //       {},
  //     );
  //     const userWithNewConfirmationCode = await UserModel.findOne({
  //       'accountData.email': email,
  //     });
  //     return userWithNewConfirmationCode!.emailConfirmation.confirmationCode;
  //   }
  //
  //   async findAccountByConfirmationCode(
  //     code: string,
  //   ): Promise<UserDBType | null> {
  //     const account = await UserModel.findOne({
  //       'emailConfirmation.confirmationCode': code,
  //     });
  //     if (!account) return null;
  //     if (new Date() > account.emailConfirmation.expirationDate) return null;
  //     return account;
  //   }
  //
  //   async confirmedAccount(accountId: string): Promise<boolean> {
  //     const confirmAccount = await UserModel.updateOne(
  //       { _id: accountId },
  //       { $set: { 'emailConfirmation.isConfirmed': true } },
  //       {},
  //     );
  //     return confirmAccount.matchedCount === 1;
  //   }
  //
  //   async accountIsConfirmed(email: string): Promise<boolean> {
  //     const account = await UserModel.findOne({ 'accountData.email': email });
  //     if (!account) return true;
  //     return !!account.emailConfirmation.isConfirmed;
  //   }
  //
  //   async addRefreshTokenToBlackList(refreshToken: string) {
  //     const payloadRefreshToken = new Buffer(
  //       refreshToken.split('.')[1],
  //       'base64',
  //     ).toString();
  //     const expirationDate = payloadRefreshToken
  //       .split(',')[2]
  //       .split(':')[1]
  //       .toString()
  //       .replace(/[^0-9]/g, '');
  //     const blockedToken: BlackListRefreshTokenType = {
  //       _id: new ObjectId().toString(),
  //       token: refreshToken,
  //       expirationDate: Number(expirationDate) * 1000,
  //     };
  //     await BlackListRefreshTokenModel.insertMany(blockedToken);
  //   }
  //
  //   async findRefreshTokenInBlackList(refreshToken: string): Promise<boolean> {
  //     const tokenInBlackList = await BlackListRefreshTokenModel.findOne({
  //       token: refreshToken,
  //     }).lean();
  //     return !!tokenInBlackList;
  //   }
  //
  //   async returnInfoAboutMe(userId: ObjectId) {
  //     const userById = await this.findUserById(userId);
  //     return {
  //       email: userById!.accountData.email,
  //       login: userById!.accountData.userName,
  //       userId: userById!._id,
  //     };
  //   }
}

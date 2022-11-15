import { UsersRepository } from '../../users/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { UserDBType } from '../../users/types/users.types';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

@Injectable()
export class AuthService {
  constructor(protected usersRepository: UsersRepository) {}

  // async checkCredentials(login: string): Promise<UserDBType | null> {
  //   return await this.usersRepository.findByLogin(login);
  // }
  //
  // async generateHash(password: string) {
  //   return await bcrypt.hash(password, 10);
  // }
  //
  // async isPasswordCorrect(password: string, hash: string) {
  //   return await bcrypt.compare(password, hash);
  // }
  //
  // async createAccessToken(login: string, expirationTime: string) {
  //   const user = await this.checkCredentials(login);
  //   return await jwtUtility.createJWT(user!._id, expirationTime);
  // }
  //
  // async createRefreshToken(login: string, expirationTime: string) {
  //   const user = await this.checkCredentials(login);
  //   return await jwtUtility.createRefreshJWT(
  //     user!._id,
  //     uuidv4().toString(),
  //     expirationTime,
  //   );
  // }

  async refreshConfirmationCode(email: string): Promise<string | null> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) return null;
    user.emailConfirmation.confirmationCode = uuidv4;
    user.emailConfirmation.expirationDate = add(new Date(), { hours: 5 });
    const update = await this.usersRepository.updateUser(user);
    if (update) return user.emailConfirmation.confirmationCode;
    return null;
  }

  async findAccountByConfirmationCode(
    code: string,
  ): Promise<UserDBType | null> {
    const account = await this.usersRepository.findAccountByConfirmationCode(
      code,
    );
    if (!account) return null;
    if (new Date() > account.emailConfirmation.expirationDate) return null;
    return account;
  }

  async confirmAccount(accountId: string): Promise<boolean> {
    return await this.usersRepository.confirmedAccount(accountId);
  }

  async accountIsConfirmed(email: string): Promise<boolean> {
    return await this.usersRepository.accountIsConfirmed(email);
  }

  // async addRefreshTokenToBlackList(refreshToken: string) {
  //   await this.usersRepository.addRefreshTokenToBlackList(refreshToken);
  // }
  //
  // async findRefreshTokenInBlackList(refreshToken: string): Promise<boolean> {
  //   return await this.usersRepository.findRefreshTokenInBlackList(refreshToken);
  // }
  //
  // async saveRefreshToken(
  //   refreshToken: string,
  //   ip: string,
  //   deviceName: string | undefined,
  // ): Promise<void> {
  //   const userId = extractUserIdFromRefreshToken(refreshToken);
  //   const deviceId = extractDeviceIdFromRefreshToken(refreshToken);
  //   const issueAt = extractIssueAtFromRefreshToken(refreshToken);
  //   const expiresAt = extractExpiresDateFromRefreshToken(refreshToken);
  //   if (userId && deviceId && issueAt && deviceName && expiresAt) {
  //     const newRefreshToken = new RefreshToken();
  //     newRefreshToken.issuedAt = issueAt;
  //     newRefreshToken.deviceId = deviceId;
  //     newRefreshToken.ip = ip;
  //     newRefreshToken.deviceName = deviceName;
  //     newRefreshToken.userId = userId;
  //     newRefreshToken.expiresAt = expiresAt;
  //     newRefreshToken.lastActiveDate = new Date();
  //     await newRefreshToken.save();
  //   }
  // }
  //
  // async updateRefreshToken(
  //   oldRefreshToken: string,
  //   newRefreshToken: string,
  //   ip: string,
  // ): Promise<void> {
  //   const issuedAtOldToken = extractIssueAtFromRefreshToken(oldRefreshToken);
  //   const userIdOldToken = extractUserIdFromRefreshToken(oldRefreshToken);
  //   const issuedAtNewToken = extractIssueAtFromRefreshToken(newRefreshToken);
  //   const expiresAtNewToken =
  //     extractExpiresDateFromRefreshToken(newRefreshToken);
  //   const token = await RefreshToken.findOne({
  //     userId: userIdOldToken!,
  //     issuedAt: issuedAtOldToken!,
  //   });
  //   token!.issuedAt = issuedAtNewToken!;
  //   token!.ip = ip;
  //   token!.expiresAt = expiresAtNewToken!;
  //   token!.lastActiveDate = new Date();
  //   await token!.save();
  // }
  // async deleteRefreshToken(refreshToken: string): Promise<void> {
  //   const issuedAtToken = extractIssueAtFromRefreshToken(refreshToken);
  //   const userId = extractUserIdFromRefreshToken(refreshToken);
  //   await RefreshToken.deleteMany({
  //     userId: userId!,
  //     issuedAt: issuedAtToken!,
  //   });
  // }
  // async changePassword(newPasswordHash: string, userId: string): Promise<void> {
  //   const user = await UserModel.findById(userId);
  //   user!.accountData.passwordHash = newPasswordHash;
  //   await user!.save();
  // }
}

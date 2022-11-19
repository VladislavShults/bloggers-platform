import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { UserDBType } from '../../../users/types/users.types';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '../../../../infrastructure/JWT-utility/jwt-service';
import { extractUserIdFromRefreshToken } from '../helpers/extractUserIdFromRefreshToken';
import { extractIssueAtFromRefreshToken } from '../helpers/extractIssueAtFromRefreshToken';
import { extractExpiresDateFromRefreshToken } from '../helpers/extractExpiresDateFromRefreshToken';
import { RefreshTokenDBType } from '../../refresh-token/types/refresh-token.types';
import { AuthRepository } from '../infrastrucrure/auth.repository';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtUtility: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async checkCredentials(login: string): Promise<UserDBType | null> {
    return await this.usersRepository.findByLogin(login);
  }

  async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async isPasswordCorrect(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async createAccessToken(userId: string, expirationTime: string) {
    return await this.jwtUtility.createJWT(userId, expirationTime);
  }

  async createRefreshToken(login: string, expirationTime: string) {
    const user = await this.checkCredentials(login);
    return await this.jwtUtility.createRefreshJWT(
      user._id.toString(),
      uuidv4().toString(),
      expirationTime,
    );
  }

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

  async saveDeviceInputInDB(
    refreshToken: string,
    ip: string,
    deviceName: string | undefined,
  ): Promise<ObjectId> {
    const userId = extractUserIdFromRefreshToken(refreshToken);
    const deviceId = await this.jwtUtility.extractDeviceIdFromToken(
      refreshToken,
    );
    const issueAt = extractIssueAtFromRefreshToken(refreshToken);
    const expiresAt = extractExpiresDateFromRefreshToken(refreshToken);
    if (userId && deviceId && issueAt && deviceName && expiresAt) {
      const newInput: Omit<RefreshTokenDBType, '_id'> = {
        issuedAt: issueAt,
        deviceId: deviceId.toString(),
        ip: ip,
        deviceName: deviceName,
        userId: userId,
        expiresAt: expiresAt,
        lastActiveDate: new Date(),
      };
      return await this.authRepository.saveDeviceInputInDB(newInput);
    }
  }

  async updateRefreshToken(
    oldRefreshToken: string,
    newRefreshToken: string,
    ip: string,
  ): Promise<void> {
    const issuedAtOldToken = extractIssueAtFromRefreshToken(oldRefreshToken);
    const userIdOldToken = extractUserIdFromRefreshToken(oldRefreshToken);
    const issuedAtNewToken = extractIssueAtFromRefreshToken(newRefreshToken);
    const expiresAtNewToken =
      extractExpiresDateFromRefreshToken(newRefreshToken);
    const token = await this.authRepository.findTokenByUserIdAndIssuedAt(
      userIdOldToken,
      issuedAtOldToken,
    );
    token.issuedAt = issuedAtNewToken;
    token.ip = ip;
    token.expiresAt = expiresAtNewToken;
    token.lastActiveDate = new Date();
    await this.authRepository.updateToken(token);
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    const issuedAtToken = extractIssueAtFromRefreshToken(refreshToken);
    const userId = extractUserIdFromRefreshToken(refreshToken);
    await this.authRepository.deleteRefreshToken(userId, issuedAtToken);
  }

  async changePassword(newPasswordHash: string, userId: string): Promise<void> {
    const user = await this.usersRepository.getUser(userId);
    user.passwordHash = newPasswordHash;
    await this.usersRepository.updateUser(user);
  }
}

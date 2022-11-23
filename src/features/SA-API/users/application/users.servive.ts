import { Injectable } from '@nestjs/common';
import { addHours } from 'date-fns';
import { UsersRepository } from '../infrastructure/users.repository';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../api/models/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserDBType } from '../types/users.types';
import { BanUserDto } from '../api/models/ban-user.dto';
import { AuthService } from '../../../public-API/auth/application/auth.service';
import { DevicesService } from '../../../public-API/devices/application/devices.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly devicesService: DevicesService,
  ) {}

  async createUser(inputModel: CreateUserDto): Promise<ObjectId> {
    const hash = await this.authService.generateHash(inputModel.password);

    const user: Omit<UserDBType, '_id'> = {
      login: inputModel.login,
      email: inputModel.email,
      createdAt: new Date(),
      passwordHash: hash,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: addHours(new Date(), 5),
        isConfirmed: false,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    };
    return await this.usersRepository.createUser(user);
  }

  async deleteUserById(userId: string): Promise<boolean> {
    return await this.usersRepository.deleteUserById(userId);
  }

  async banAndUnbanUser(
    userId: string,
    banModel: BanUserDto,
  ): Promise<boolean> {
    if (userId.length !== 24) return false;
    const user = await this.usersRepository.getUser(userId);
    if (!user) return false;
    if (banModel.isBanned && !user.banInfo.isBanned) {
      user.banInfo.isBanned = true;
      user.banInfo.banDate = new Date();
      user.banInfo.banReason = banModel.banReason;
      await this.usersRepository.updateUser(user);
      await this.devicesService.terminateAllSessionByUserId(userId);
      return;
    }
    if (!banModel.isBanned && user.banInfo.isBanned) {
      user.banInfo.isBanned = false;
      user.banInfo.banDate = null;
      user.banInfo.banReason = null;
      await this.usersRepository.updateUser(user);
      return;
    }
  }

  async findUserByEmail(email: string): Promise<UserDBType | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    let user: UserDBType | null = null;
    const accountByEmail = await this.usersRepository.findUserByEmail(
      loginOrEmail,
    );
    if (accountByEmail) {
      user = accountByEmail;
    }
    const accountByLogin = await this.usersRepository.findByLogin(loginOrEmail);
    if (accountByLogin) {
      user = accountByLogin;
    }
    return user;
  }

  async findUserById(userId: string) {
    return this.usersRepository.getUser(userId);
  }
}

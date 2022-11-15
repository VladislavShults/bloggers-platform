import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../api/models/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserDBType } from '../types/users.types';
import { BanUserDto } from '../api/models/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(inputModel: CreateUserDto): Promise<ObjectId> {
    const hash = inputModel.password + 'bad password';

    const user: Omit<UserDBType, '_id'> = {
      login: inputModel.login,
      email: inputModel.email,
      createdAt: new Date(),
      passwordHash: hash,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: new Date(new Date().getHours() + 5),
        isConfirmed: false,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: 'new user',
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
    if (banModel.isBanned) {
      user.banInfo.isBanned = true;
      user.banInfo.banDate = new Date();
      user.banInfo.banReason = banModel.banReason;
      await this.usersRepository.updateUser(user);
      return;
    }
    if (!banModel.isBanned) {
      user.banInfo.isBanned = false;
      user.banInfo.banDate = null;
      user.banInfo.banReason = banModel.banReason;
      await this.usersRepository.updateUser(user);
      return;
    }
  }
}

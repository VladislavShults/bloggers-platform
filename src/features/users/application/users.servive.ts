import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../api/models/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserDBType } from '../types/users.types';

@Injectable()
export class UsersService {
  constructor(
    // private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(inputModel: CreateUserDto): Promise<ObjectId> {
    const hash = inputModel.password + 'bad password';

    const user: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        userName: inputModel.login,
        email: inputModel.email,
        passwordHash: hash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: new Date(new Date().getHours() + 5),
        isConfirmed: false,
      },
    };
    console.log(user.emailConfirmation.isConfirmed);
    await this.usersRepository.createUser(user);
    return user._id;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    return await this.usersRepository.deleteUserById(userId);
  }
}

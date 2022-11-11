import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './models/create-user.dto';
import {
  ViewUsersTypeWithPagination,
  ViewUserType,
} from '../types/users.types';
import { UsersService } from '../application/users.servive';
import { UsersQueryRepository } from './users.query.repository';
import { QueryUserDto } from './models/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createUser(@Body() inputModel: CreateUserDto): Promise<ViewUserType> {
    const userObjectId = await this.usersService.createUser(inputModel);
    const user = await this.usersQueryRepository.getUserById(
      userObjectId.toString(),
    );
    return user;
  }

  @Get()
  async getUsers(
    @Query() query: QueryUserDto,
  ): Promise<ViewUsersTypeWithPagination> {
    const users = await this.usersQueryRepository.getUsers(query);
    return users;
  }
}

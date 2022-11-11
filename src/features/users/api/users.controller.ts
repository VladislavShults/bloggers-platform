import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './models/create-user.dto';
import {
  ViewUsersTypeWithPagination,
  ViewUserType,
} from '../types/users.types';
import { UsersService } from '../application/users.servive';
import { UsersQueryRepository } from './users.query.repository';
import { QueryUserDto } from './models/query-user.dto';
import { URIParamUserDto } from './models/URIParam-user.dto';

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

  @Delete(':userId')
  @HttpCode(204)
  async deleteUserById(@Param() params: URIParamUserDto): Promise<HttpStatus> {
    const deletedUser = await this.usersService.deleteUserById(params.userId);
    if (!deletedUser)
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }
}

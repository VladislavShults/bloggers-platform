import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
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
import { BanUserDto } from './models/ban-user.dto';
import { BasicAuthGuard } from '../../auth/auth/guards/basic-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async createUser(@Body() inputModel: CreateUserDto): Promise<ViewUserType> {
    const userObjectId = await this.usersService.createUser(inputModel);
    const user = await this.usersQueryRepository.getUserByIdViewType(
      userObjectId.toString(),
    );
    return user;
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  async getUsers(
    @Query() query: QueryUserDto,
  ): Promise<ViewUsersTypeWithPagination> {
    const users = await this.usersQueryRepository.getUsers(query);
    return users;
  }

  @Delete(':userId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteUserById(@Param() params: URIParamUserDto): Promise<HttpStatus> {
    const deletedUser = await this.usersService.deleteUserById(params.userId);
    if (!deletedUser)
      throw new BadRequestException([
        { message: 'Bad user id', field: 'userId' },
      ]);
    return;
  }

  @Put(':userId/ban')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async banAndUnbanUser(
    @Param() params: URIParamUserDto,
    @Body() inputModel: BanUserDto,
  ): Promise<HttpStatus> {
    await this.usersService.banAndUnbanUser(params.userId, inputModel);
    return;
  }
}

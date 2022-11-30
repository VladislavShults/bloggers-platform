import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../../../public-API/blogs/application/blogs.service';
import { URIParamUserDto } from '../../../SA-API/users/api/models/URIParam-user.dto';
import { JwtAuthGuard } from '../../../public-API/auth/guards/JWT-auth.guard';
import { BanUserForBlogDto } from './models/ban-user-for-blog.dto';
import { URIParamBlogDto } from '../../../public-API/blogs/api/models/URIParam-blog.dto';
import { BlogsQueryRepository } from '../../../public-API/blogs/api/blogs.query.repository';
import { ViewBannedUsersForBlogWithPaginationType } from '../../../public-API/blogs/types/blogs.types';
import { CheckBlogInDBAndBlogOwnerGuard } from '../../blogs/guards/chechBlogOwner.guard';
import { UsersService } from '../../../SA-API/users/application/users.servive';
import { createErrorMessage } from '../../../public-API/auth/helpers/create-error-message';
import { QueryBannedUsersDto } from './models/query-banned-users.dto';

@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly usersService: UsersService,
  ) {}
  @Put(':userId/ban')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, CheckBlogInDBAndBlogOwnerGuard)
  async banAndUnbanUser(
    @Param() params: URIParamUserDto,
    @Body() inputModel: BanUserForBlogDto,
  ): Promise<HttpStatus> {
    const user = await this.usersService.findUserById(params.userId);
    if (!user) throw new BadRequestException(createErrorMessage('userId'));

    await this.blogsService.banAndUnbanUserByBlog(params.userId, inputModel);
    return;
  }

  @Get('blog/:blogId')
  @UseGuards(JwtAuthGuard)
  async getAllPostsByBlogId(
    @Param() params: URIParamBlogDto,
    @Query() query: QueryBannedUsersDto,
  ): Promise<ViewBannedUsersForBlogWithPaginationType> {
    return await this.blogsQueryRepository.getAllBannedUserForBlog(
      params.blogId,
      query,
    );
  }
}

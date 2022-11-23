import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../public-API/auth/guards/basic-auth.guard';
import { URIParamBindUserToBlog } from './models/URI-paramBindUserToBlog';
import { UsersService } from '../../users/application/users.servive';
import { createErrorMessage } from '../../../public-API/auth/helpers/create-error-message';
import { BlogsService } from '../../../public-API/blogs/application/blogs.service';
import { QueryBlogDto } from '../../../public-API/blogs/api/models/query-blog.dto';
import { AdminBlogQueryRepository } from './admin.blog.query.repository';

@Controller('sa/blogs')
export class AdminBlogsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly blogsService: BlogsService,
    private readonly adminBlogQueryRepository: AdminBlogQueryRepository,
  ) {}

  @Put(':blogId/bind-with-user/:userId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async bindUserToBlog(@Param() params: URIParamBindUserToBlog) {
    const user = await this.usersService.findUserById(params.userId);
    if (!user) throw new BadRequestException(createErrorMessage('userId'));

    const blog = await this.blogsService.findBlogById(params.blogId);
    if (!blog || blog.blogOwnerInfo.userId)
      throw new BadRequestException(createErrorMessage('blogId'));

    await this.blogsService.bindUserToBlog(blog, user);
    return;
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  async getBlogs(@Query() query: QueryBlogDto) {
    return await this.adminBlogQueryRepository.getBlogs(query);
  }
}

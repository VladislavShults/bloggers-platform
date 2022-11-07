import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBlogDto } from './models/create-blog.dto';
import { ViewBlogType } from '../types/blogs.types';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from './blogs.query.repository';
import { URIParamBlogDto } from './models/URIParam-blog.dto';
import { ObjectId } from 'mongodb';
import { UpdateBlogDto } from './models/update-blog.dto';
import { QueryBlogDto } from './models/query-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService, // private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Post()
  async createBlog(
    @Body() createBlogsDTO: CreateBlogDto,
  ): Promise<ViewBlogType> {
    const newBlogObjectId: ObjectId = await this.blogsService.createBlog(
      createBlogsDTO,
    );
    const newBlog: ViewBlogType = await this.blogsQueryRepository.findBlogById(
      newBlogObjectId.toString(),
    );
    return newBlog;
  }

  @Get(':blogId')
  async findBlogById(@Param() params: URIParamBlogDto): Promise<ViewBlogType> {
    const blog = await this.blogsQueryRepository.findBlogById(params.blogId);
    return blog;
  }

  @Put(':blogId')
  async updateBlog(
    @Param() params: URIParamBlogDto,
    @Body() updateBlogDTO: UpdateBlogDto,
  ): Promise<HttpStatus> {
    const desiredBlogger: boolean = await this.blogsService.updateBlogById(
      params.blogId,
      updateBlogDTO.name,
      updateBlogDTO.youtubeUrl,
    );
    if (desiredBlogger) {
      return HttpStatus.OK;
    } else throw new BadRequestException('BLOG NOT FOUND');
  }

  @Delete(':blogId')
  async deleteBlogById(@Param() params: URIParamBlogDto): Promise<HttpStatus> {
    const deleteBlog = await this.blogsService.deleteBlogById(params.blogId);
    if (deleteBlog) {
      return HttpStatus.OK;
    } else throw new BadRequestException('BLOG NOT FOUND');
  }

  @Get()
  async getBlogs(@Query() query: QueryBlogDto) {
    const searchNameTerm: string = query.searchNameTerm || '';
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    const blogs = await this.blogsQueryRepository.getBlogs(
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
    return blogs;
  }
}

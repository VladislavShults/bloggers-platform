import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ViewBlogType } from './types/blogs.types';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query.repository';
import { URIParamBlogDto } from './dto/URIParam-blog.dto';
import { ObjectId } from 'mongodb';

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
}

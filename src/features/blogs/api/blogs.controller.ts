import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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
import { PostsService } from '../../posts/application/posts.service';
import {
  ViewPostsTypeWithoutLikesWithPagination,
  ViewPostWithoutLikesType,
} from '../../posts/types/posts.types';
import { PostsQueryRepository } from '../../posts/api/posts.query.repository';
import { QueryGetPostsByBlogIdDto } from './models/query-getPostsByBlogId.dto';
import { CreatePostBySpecificBlogDto } from './models/create-postBySpecificBlog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
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
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    return blog;
  }

  @Put(':blogId')
  @HttpCode(204)
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
      return;
    } else throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlogById(@Param() params: URIParamBlogDto): Promise<HttpStatus> {
    const deleteBlog = await this.blogsService.deleteBlogById(params.blogId);
    if (!deleteBlog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return;
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

  @Get(':blogId/posts')
  async getAllPostsByBlogId(
    @Param() params: URIParamBlogDto,
    @Query() query: QueryGetPostsByBlogIdDto,
  ): Promise<ViewPostsTypeWithoutLikesWithPagination> {
    const posts = await this.postsQueryRepository.getPostsByBlogId(
      params.blogId,
      query,
    );
    if (!posts)
      throw new HttpException('POSTS NOT FOUND', HttpStatus.NOT_FOUND);
    return posts;
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForSpecificBlog(
    @Param() params: URIParamBlogDto,
    @Body() inputModel: CreatePostBySpecificBlogDto,
  ): Promise<ViewPostWithoutLikesType> {
    const blog = await this.blogsQueryRepository.findBlogById(params.blogId);
    if (!blog) throw new HttpException('BLOG NOT FOUND', HttpStatus.NOT_FOUND);

    const createPostDTO = this.blogsService.createPostDTO(
      params.blogId,
      inputModel,
    );

    const postObjectId = await this.postsService.createPost(createPostDTO);

    const postDBType = await this.postsQueryRepository.getPostById(
      postObjectId.toString(),
    );

    return postDBType;
  }
}

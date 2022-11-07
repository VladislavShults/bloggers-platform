import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './models/create-post.dto';
import { ObjectId } from 'mongodb';
import { ViewPostType } from '../types/posts.types';
import { PostsService } from '../application/posts.service';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsQueryRepository } from './posts.query.repository';
import { URIParamPostDto } from './models/URIParam-post.dto';
import { QueryBlogDto } from '../../blogs/api/models/query-blog.dto';
import { UpdatePostDto } from './models/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}
  @Post()
  async createPost(
    @Body() createPostDTO: CreatePostDto,
  ): Promise<ViewPostType> {
    const newPostObjectId: ObjectId = await this.postsService.createPost(
      createPostDTO,
    );
    const post: ViewPostType = await this.postsQueryRepository.getPostById(
      newPostObjectId.toString(),
    );
    return post;
  }

  @Get(':postId')
  async getPostById(@Param() params: URIParamPostDto): Promise<ViewPostType> {
    const post = await this.postsQueryRepository.getPostById(params.postId);
    if (post) return post;
    else throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Get()
  async getPosts(@Query() query: QueryBlogDto) {
    const searchNameTerm: string = query.searchNameTerm || '';
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    const blogs = await this.postsQueryRepository.getPosts(
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
    return blogs;
  }

  @Put(':postId')
  async updatePost(
    @Param() params: URIParamPostDto,
    @Body() inputModel: UpdatePostDto,
  ): Promise<HttpStatus> {
    const updatePost = await this.postsService.updatePost(
      params.postId,
      inputModel,
    );
    if (!updatePost)
      throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    return HttpStatus.NO_CONTENT;
  }
}

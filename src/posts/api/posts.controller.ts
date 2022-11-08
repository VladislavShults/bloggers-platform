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
import { CreateCommentDto } from '../../comments/api/models/create-comment.dto';
import { ViewCommentType } from '../../comments/types/comments.types';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryRepository } from '../../comments/api/comments.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly postsRepository: PostsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
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
  @HttpCode(204)
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
    return;
  }

  @Delete(':postId')
  @HttpCode(204)
  async deletePostById(@Param() params: URIParamPostDto): Promise<HttpStatus> {
    const result = await this.postsService.deletePostById(params.postId);
    if (!result)
      throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }

  @Post('postId/comment')
  @HttpCode(201)
  async createCommentByPost(
    @Param() params: URIParamPostDto,
    @Body() inputModel: CreateCommentDto,
  ): Promise<ViewCommentType> {
    const commentObjectId = await this.commentsService.createCommentByPost(
      params.postId,
      inputModel,
    );
    const comment = await this.commentsQueryRepository.getCommentById(
      commentObjectId.toString(),
    );
    return comment;
  }
}

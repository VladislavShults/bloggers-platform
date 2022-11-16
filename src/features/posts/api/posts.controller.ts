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
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './models/create-post.dto';
import { ObjectId } from 'mongodb';
import { ViewPostWithoutLikesType } from '../types/posts.types';
import { PostsService } from '../application/posts.service';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsQueryRepository } from './posts.query.repository';
import { URIParamPostDto } from './models/URIParam-post.dto';
import { UpdatePostDto } from './models/update-post.dto';
import { CreateCommentDto } from '../../comments/api/models/create-comment.dto';
import {
  ViewCommentsTypeWithPagination,
  ViewCommentType,
} from '../../comments/types/comments.types';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryRepository } from '../../comments/api/comments.query.repository';
import { QueryPostDto } from './models/query-post.dto';
import { LikeStatusPostDto } from './models/like-status.post.dto';
import { BasicAuthGuard } from '../../auth/auth/guards/basic-auth.guard';
import { JwtAuthGuard } from '../../auth/auth/guards/JWT-auth.guard';

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
  @UseGuards(BasicAuthGuard)
  async createPost(
    @Body() createPostDTO: CreatePostDto,
  ): Promise<ViewPostWithoutLikesType> {
    const newPostObjectId: ObjectId = await this.postsService.createPost(
      createPostDTO,
    );
    return await this.postsQueryRepository.getPostById(
      newPostObjectId.toString(),
    );
  }

  @Get(':postId')
  async getPostById(
    @Param() params: URIParamPostDto,
  ): Promise<ViewPostWithoutLikesType> {
    const post = await this.postsQueryRepository.getPostById(params.postId);
    if (post) return post;
    else throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
  }

  @Get()
  async getPosts(@Query() query: QueryPostDto) {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    return await this.postsQueryRepository.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @Put(':postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  async deletePostById(@Param() params: URIParamPostDto): Promise<HttpStatus> {
    const result = await this.postsService.deletePostById(params.postId);
    if (!result)
      throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }

  @Post(':postId/comments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createCommentByPost(
    @Param() params: URIParamPostDto,
    @Body() inputModel: CreateCommentDto,
  ): Promise<ViewCommentType> {
    const post = await this.postsQueryRepository.getPostById(params.postId);
    if (!post) throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    const commentObjectId = await this.commentsService.createCommentByPost(
      params.postId,
      inputModel,
    );
    return await this.commentsQueryRepository.getCommentById(
      commentObjectId.toString(),
    );
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param() params: URIParamPostDto,
    @Query() query: QueryPostDto,
  ): Promise<ViewCommentsTypeWithPagination> {
    const comments = await this.commentsQueryRepository.getCommentsByPostId(
      params.postId,
      query,
    );
    if (!comments)
      throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    return comments;
  }
  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async makeLikeOrUnlike(
    @Param() params: URIParamPostDto,
    @Body() inputModel: LikeStatusPostDto,
  ) {
    // const userId: ObjectId | null = await extractUserIdFromHeaders(req);
    await this.postsService.makeLikeOrUnlike(
      params.postId,
      inputModel.likeStatus,
    );
    return;
  }
}

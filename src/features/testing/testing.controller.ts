import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { PostDBType } from '../posts/types/posts.types';
import { BlogDBType } from '../blogs/types/blogs.types';
import { CommentDBType } from '../comments/types/comments.types';
import { UserDBType } from '../users/types/users.types';
import { RefreshTokenDBType } from '../auth/refresh-token/types/refresh-token.types';
import { LikeDBType } from '../likes/types/likes.types';

@Controller('testing')
export class TestingController {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
    @Inject('COMMENT_MODEL')
    private readonly commentModel: Model<CommentDBType>,
    @Inject('USER_MODEL')
    private readonly userModel: Model<UserDBType>,
    @Inject('REFRESH_TOKEN_MODEL')
    private readonly refreshTokenModel: Model<RefreshTokenDBType>,
    @Inject('LIKES_MODEL')
    private readonly likesModel: Model<LikeDBType>,
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  async clearAllData(): Promise<HttpStatus> {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.refreshTokenModel.deleteMany({});
    await this.likesModel.deleteMany({});
    return;
  }
}

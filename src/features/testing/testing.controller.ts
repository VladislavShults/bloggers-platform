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

@Controller('testing')
export class TestingController {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
    @Inject('COMMENT_MODEL')
    private readonly commentModel: Model<CommentDBType>,
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  async clearAllData(): Promise<HttpStatus> {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.commentModel.deleteMany({});
    return;
  }
}

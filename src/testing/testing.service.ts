import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostDBType } from '../posts/types/posts.types';
import { BlogDBType } from '../blogs/types/blogs.types';
import { CommentDBType } from '../comments/types/comments.types';

@Injectable()
export class TestingService {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
    @Inject('COMMENT_MODEL')
    private readonly commentModel: Model<CommentDBType>,
  ) {}
  async clearAllData(): Promise<boolean> {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.commentModel.deleteMany({});
    return true;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogDBType } from './types/blogs.types';

@Injectable()
export class BlogsRepository {
  constructor(
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
  ) {}

  async createBlog(newBlog: BlogDBType): Promise<void> {
    await this.blogModel.create(newBlog);
  }
}

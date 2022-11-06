import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogDBType, ViewBlogType } from './types/blogs.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
  ) {}

  async findBlogById(blogId: string): Promise<ViewBlogType> {
    const blogDBType = await this.blogModel.findById(blogId);
    const blog: ViewBlogType = {
      id: blogDBType._id.toString(),
      name: blogDBType.name,
      youtubeUrl: blogDBType.youtubeUrl,
      createdAt: blogDBType.createdAt,
    };
    return blog;
  }
}

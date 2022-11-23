import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogDBType } from '../../../public-API/blogs/types/blogs.types';

@Injectable()
export class BloggersBlogsRepository {
  constructor(
    @Inject('BLOG_MODEL')
    private readonly blogModel: Model<BlogDBType>,
  ) {}
  getBlogById(blogId: string) {
    return this.blogModel.findById(blogId);
  }

  deleteBlogById(blogId: string) {
    return this.blogModel.deleteOne({ _id: blogId });
  }

  async updateBlog(blog) {
    await blog.save();
  }

  async createBlog(newBlog: Omit<BlogDBType, '_id'>): Promise<string> {
    const blog = await this.blogModel.create(newBlog);
    return blog._id.toString();
  }
}

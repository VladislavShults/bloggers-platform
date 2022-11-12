import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogDBType } from '../types/blogs.types';

@Injectable()
export class BlogsRepository {
  constructor(
    @Inject('BLOG_MODEL')
    private readonly blogModel: Model<BlogDBType>,
  ) {}

  async createBlog(newBlog: BlogDBType): Promise<void> {
    await this.blogModel.create(newBlog);
  }

  async getBlogById(blogId: string) {
    const blog = await this.blogModel.findById(blogId);
    return blog;
  }

  async updateBlog(blog): Promise<boolean> {
    const updateBlog = await blog.save();
    return updateBlog.modifiedPaths.length > 0;
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: blogId });
    return result.deletedCount > 0;
  }

  async getLoginBloggerByBlogId(blogId: string): Promise<string> {
    const blog = await this.blogModel.findById(blogId);
    const login = blog.name;
    return login;
  }
}

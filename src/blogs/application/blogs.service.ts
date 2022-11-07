import { Inject, Injectable } from '@nestjs/common';
import { BlogDBType } from '../types/blogs.types';
import { Model } from 'mongoose';
import { CreateBlogDto } from '../api/models/create-blog.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('BLOG_MODEL')
    private readonly blogModel: Model<Document & BlogDBType>,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async createBlog(createBlogDTO: CreateBlogDto): Promise<ObjectId> {
    const newBlog: BlogDBType = {
      _id: new ObjectId(),
      name: createBlogDTO.name,
      youtubeUrl: createBlogDTO.youtubeUrl,
      createdAt: new Date(),
    };
    await this.blogsRepository.createBlog(newBlog);
    return newBlog._id;
  }

  async updateBlogById(blogId: string, name: string, youtubeUrl: string) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    blog.name = name;
    blog.youtubeUrl = youtubeUrl;
    const updateBlog = await this.blogsRepository.updateBlog(blog);
    if (updateBlog) return true;
    else return false;
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlogById(blogId);
  }
}

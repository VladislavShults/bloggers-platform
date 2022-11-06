import { Inject, Injectable } from '@nestjs/common';
import { BlogDBType } from './types/blogs.types';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogsRepository } from './blogs.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
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
}

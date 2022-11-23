import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { UpdateBlogDto } from '../api/models/update-blog.dto';
import { CreateBlogDto } from '../api/models/create-blog.dto';
import { UserDBType } from '../../../SA-API/users/types/users.types';
import { BlogDBType } from '../types/blogs.types';
import { CreatePostBySpecificBlogDto } from '../api/models/create-postBySpecificBlog.dto';
import { CreatePostDto } from '../../posts/api/models/create-post.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async deleteBlogById(blogId: string) {
    return this.blogsRepository.deleteBlogById(blogId);
  }

  async updateBlogById(blogId: string, updateBlogDTO: UpdateBlogDto) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    blog.name = updateBlogDTO.name;
    blog.websiteUrl = updateBlogDTO.websiteUrl;
    blog.description = updateBlogDTO.description;
    await this.blogsRepository.updateBlog(blog);
  }

  async createBlog(
    createBlogDTO: CreateBlogDto,
    user: UserDBType,
  ): Promise<string> {
    const newBlog: Omit<BlogDBType, '_id'> = {
      name: createBlogDTO.name,
      description: createBlogDTO.description,
      websiteUrl: createBlogDTO.websiteUrl,
      createdAt: new Date(),
      blogOwnerInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
    };
    return this.blogsRepository.createBlog(newBlog);
  }

  createPostDTO(
    blogId: string,
    inputModel: CreatePostBySpecificBlogDto,
  ): CreatePostDto {
    return {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
    };
  }

  async findBlogById(blogId: string) {
    return this.blogsRepository.getBlogById(blogId);
  }

  async bindUserToBlog(blog: BlogDBType, user: UserDBType) {
    blog.blogOwnerInfo.userId = user._id.toString();
    blog.blogOwnerInfo.userLogin = user.login;
    await this.blogsRepository.updateBlog(blog);
  }
}

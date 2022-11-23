import { Injectable } from '@nestjs/common';
import { BloggersBlogsRepository } from '../infrastructure/bloggers.blogs.repository';
import { UpdateBlogDto } from '../../../public-API/blogs/api/models/update-blog.dto';
import { CreateBlogDto } from '../../../public-API/blogs/api/models/create-blog.dto';
import { UserDBType } from '../../../public-API/users/types/users.types';
import { BlogDBType } from '../../../public-API/blogs/types/blogs.types';
import { CreatePostBySpecificBlogDto } from '../../../public-API/blogs/api/models/create-postBySpecificBlog.dto';
import { CreatePostDto } from '../../../public-API/posts/api/models/create-post.dto';

@Injectable()
export class BloggersBlogsService {
  constructor(private readonly blogsRepository: BloggersBlogsRepository) {}

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
}

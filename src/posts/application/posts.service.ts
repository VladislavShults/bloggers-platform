import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostDto } from '../api/models/create-post.dto';
import { ObjectId } from 'mongodb';
import { PostDBType } from '../types/posts.types';
import { BlogsQueryRepository } from '../../blogs/api/blogs.query.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository, // private readonly usersService: UsersService,
  ) {}

  async createPost(createPostDTO: CreatePostDto): Promise<ObjectId> {
    const post: PostDBType = {
      _id: new ObjectId(),
      title: createPostDTO.title,
      shortDescription: createPostDTO.shortDescription,
      content: createPostDTO.content,
      blogId: createPostDTO.blogId,
      blogName: await this.blogsQueryRepository.getLoginBloggerByBlogId(
        createPostDTO.blogId,
      ),
      createdAt: new Date(),
      likesCount: 0,
      dislikesCount: 0,
    };
    await this.postsRepository.createPost(post);
    return post._id;
  }
}

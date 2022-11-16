import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostDto } from '../api/models/create-post.dto';
import { ObjectId } from 'mongodb';
import { PostDBType } from '../types/posts.types';
import { UpdatePostDto } from '../api/models/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository, // private readonly usersService: UsersService,
  ) {}

  async createPost(createPostDTO: CreatePostDto): Promise<ObjectId> {
    const post: Omit<PostDBType, '_id'> = {
      title: createPostDTO.title,
      shortDescription: createPostDTO.shortDescription,
      content: createPostDTO.content,
      blogId: createPostDTO.blogId,
      blogName: await this.blogsRepository.getLoginBloggerByBlogId(
        createPostDTO.blogId,
      ),
      createdAt: new Date(),
      likesCount: 0,
      dislikesCount: 0,
    };
    return await this.postsRepository.createPost(post);
  }

  async updatePost(
    postId: string,
    inputModel: UpdatePostDto,
  ): Promise<boolean> {
    this.verifyPostId(postId);
    const post = await this.postsRepository.getPostById(postId);
    if (!post) return false;
    post.title = inputModel.title;
    post.shortDescription = inputModel.shortDescription;
    post.content = inputModel.content;
    return await this.postsRepository.updatePost(post);
  }

  async deletePostById(postId: string): Promise<boolean> {
    this.verifyPostId(postId);
    return await this.postsRepository.deletePostById(postId);
  }

  private verifyPostId = (postId: string): boolean => {
    return postId.length === 24;
  };

  async makeLikeOrUnlike(
    postId: string,
    likeStatus: 'Like' | 'Dislike' | 'None',
  ) {
    if (postId.length !== 24) return;
  }
}

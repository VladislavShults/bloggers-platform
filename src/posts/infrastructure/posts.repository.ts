import { Inject, Injectable } from '@nestjs/common';
import { PostDBType } from '../types/posts.types';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
  ) {}
  async createPost(post: PostDBType): Promise<void> {
    await this.postModel.create(post);
  }

  async getPostById(postId: string) {
    const post = await this.postModel.findById(postId);
    if (post) return post;
    else return null;
  }

  async updatePost(post): Promise<boolean> {
    const result = await post.save();
    return result.modifiedCount > 0;
  }
}

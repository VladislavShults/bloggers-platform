import { Inject, Injectable } from '@nestjs/common';
import { PostDBType, ViewPostType } from '../types/posts.types';
import { Model } from 'mongoose';
import { mapPost } from '../helpers/mapPostDBToViewModel';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
  ) {}

  async getPostById(postId: string): Promise<ViewPostType> {
    const postDBType = await this.postModel.findById(postId);
    const postViewType: ViewPostType = mapPost(postDBType);
    return postViewType;
  }
}

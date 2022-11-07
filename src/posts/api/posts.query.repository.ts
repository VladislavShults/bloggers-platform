import { Inject, Injectable } from '@nestjs/common';
import {
  PostDBType,
  ViewPostsTypeWithPagination,
  ViewPostType,
} from '../types/posts.types';
import { Model } from 'mongoose';
import { mapPost } from '../helpers/mapPostDBToViewModel';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
  ) {}

  async getPostById(postId: string): Promise<ViewPostType | null> {
    const postDBType = await this.postModel.findById(postId);
    if (!postDBType) return null;
    const postViewType: ViewPostType = mapPost(postDBType);
    return postViewType;
  }

  async getPosts(
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<ViewPostsTypeWithPagination> {
    const itemsDBType = await this.postModel
      .find({ name: { $regex: searchNameTerm } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();

    const items = itemsDBType.map((i) => mapPost(i));

    return {
      pagesCount: Math.ceil(
        (await this.postModel.count({ name: { $regex: searchNameTerm } })) /
          pageSize,
      ),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: await this.postModel.count({
        name: { $regex: searchNameTerm },
      }),
      items,
    };
  }
}

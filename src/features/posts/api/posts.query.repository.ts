import { Inject, Injectable } from '@nestjs/common';
import {
  PostDBType,
  ViewPostsTypeWithoutLikesWithPagination,
  ViewPostsTypeWithPagination,
  ViewPostType,
  ViewPostWithoutLikesType,
} from '../types/posts.types';
import { Model } from 'mongoose';
import { mapPost } from '../helpers/mapPostDBToViewModel';
import { QueryGetPostsByBlogIdDto } from '../../blogs/api/models/query-getPostsByBlogId.dto';
import { mapPostsDBToViewModelWithoutLikes } from '../helpers/mapPostsDBToViewModelWithoutLikes';
import { mapPostViewModelToModelWithoutLikes } from '../helpers/mapPostViewModelToModelWithoutLikes';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
  ) {}

  async getPostById(postId: string): Promise<ViewPostType | null> {
    if (postId.length !== 24) return null;
    const postDBType = await this.postModel.findById(postId);
    if (!postDBType) return null;
    const postViewType: ViewPostType = mapPost(postDBType);
    return postViewType;
  }

  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<ViewPostsTypeWithoutLikesWithPagination> {
    const itemsDBType = await this.postModel
      .find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();

    const items = itemsDBType.map((i) => mapPost(i));

    return {
      pagesCount: Math.ceil((await this.postModel.count()) / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: await this.postModel.count(),
      items,
    };
  }

  async getPostsByBlogId(
    blogId: string,
    query: QueryGetPostsByBlogIdDto,
  ): Promise<ViewPostsTypeWithoutLikesWithPagination | null> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    const itemsDBType = await this.postModel
      .find({ blogId: blogId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();

    if (itemsDBType.length === 0) return null;

    const items = itemsDBType.map((i) => mapPostsDBToViewModelWithoutLikes(i));

    return {
      pagesCount: Math.ceil(
        (await this.postModel.count({ blogId: blogId })) / pageSize,
      ),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: await this.postModel.count({ blogId: blogId }),
      items,
    };
  }
}

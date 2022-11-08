import { Inject, Injectable } from '@nestjs/common';
import {
  PostDBType,
  ViewPostsTypeWithoutLikesWithPagination,
  ViewPostsTypeWithPagination,
  ViewPostType,
} from '../types/posts.types';
import { Model } from 'mongoose';
import { mapPost } from '../helpers/mapPostDBToViewModel';
import { QueryBlogDto } from '../../blogs/api/models/query-blog.dto';
import { QueryGetPostsByBlogIdDto } from '../../blogs/api/models/query-getPostsByBlogId.dto';
import { mapPostsDBToViewModelWithoutLikes } from '../helpers/mapPostsDBToViewModelWithoutLikes';

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

import { Inject, Injectable } from '@nestjs/common';
import {
  NewestLikesType,
  PostDBType,
  ViewPostsTypeWithoutLikesWithPagination,
  ViewPostType,
} from '../types/posts.types';
import { Model } from 'mongoose';
import { mapPost } from '../helpers/mapPostDBToViewModel';
import { QueryGetPostsByBlogIdDto } from '../../blogs/api/models/query-getPostsByBlogId.dto';
import { mapPostsDBToViewModelWithoutLikes } from '../helpers/mapPostsDBToViewModelWithoutLikes';
import { LikeDBType } from '../../likes/types/likes.types';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @Inject('POST_MODEL')
    private readonly postModel: Model<PostDBType>,
    @Inject('LIKES_MODEL')
    private readonly likesModel: Model<LikeDBType>,
  ) {}

  async getPostById(
    postId: string,
    userId?: string,
  ): Promise<ViewPostType | null> {
    if (postId.length !== 24) return null;
    const postDBType = await this.postModel.findById(postId);
    if (!postDBType) return null;
    const post = mapPost(postDBType);

    let myLikeOrDislike: LikeDBType | null = null;

    const threeNewestLikes: NewestLikesType[] = await this.likesModel
      .find({ idObject: postId, postOrComment: 'post', status: 'Like' })
      .sort({ addedAt: -1 })
      .select('-_id -idObject -status -postOrComment')
      .limit(3)
      .lean();

    if (threeNewestLikes.length > 0)
      post.extendedLikesInfo.newestLikes = threeNewestLikes;

    if (userId) {
      myLikeOrDislike = await this.likesModel
        .findOne({
          idObject: postId,
          postOrComment: 'post',
          userId: userId,
        })
        .lean();
    }
    if (myLikeOrDislike)
      post.extendedLikesInfo.myStatus = myLikeOrDislike.status;

    return post;
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

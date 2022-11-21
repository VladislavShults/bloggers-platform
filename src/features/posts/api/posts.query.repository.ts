import { Inject, Injectable } from '@nestjs/common';
import {
  NewestLikesType,
  PostDBType,
  ViewPostsTypeWithPagination,
  ViewPostType,
} from '../types/posts.types';
import { Model } from 'mongoose';
import { mapPost } from '../helpers/mapPostDBToViewModel';
import { QueryGetPostsByBlogIdDto } from '../../blogs/api/models/query-getPostsByBlogId.dto';
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
    userId: string,
    blogId?: string,
  ): Promise<ViewPostsTypeWithPagination> {
    let myLikeOrDislike: LikeDBType | null = null;
    let itemsDBType: PostDBType[];
    let totalCount: number;

    if (!blogId) totalCount = await this.postModel.count();
    else totalCount = await this.postModel.count({ blogId: blogId });

    if (!blogId) {
      itemsDBType = await this.postModel
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();
    } else {
      itemsDBType = await this.postModel
        .find({ blogId: blogId })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort([[sortBy, sortDirection]])
        .lean();
    }

    const itemsWithoutNewestLikesAndMyStatus = itemsDBType.map((i) =>
      mapPost(i),
    );

    const items = await Promise.all(
      itemsWithoutNewestLikesAndMyStatus.map(async (i) => {
        const threeNewestLikes: NewestLikesType[] = await this.likesModel
          .find({ idObject: i.id, postOrComment: 'post', status: 'Like' })
          .sort({ addedAt: -1 })
          .select('-_id -idObject -status -postOrComment')
          .limit(3)
          .lean();

        if (threeNewestLikes.length > 0)
          i.extendedLikesInfo.newestLikes = threeNewestLikes;

        if (!userId) return i;

        if (userId) {
          myLikeOrDislike = await this.likesModel
            .findOne({
              idObject: i.id,
              postOrComment: 'post',
              userId: userId,
            })
            .lean();
        }

        if (myLikeOrDislike)
          i.extendedLikesInfo.myStatus = myLikeOrDislike.status;

        return i;
      }),
    );

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items,
    };
  }

  async getPostsByBlogId(
    blogId: string,
    query: QueryGetPostsByBlogIdDto,
    userId: string,
  ): Promise<ViewPostsTypeWithPagination | null> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    const post = await this.postModel.find({ blogId: blogId });
    if (!post) return null;

    return await this.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      userId,
      blogId,
    );
  }
}

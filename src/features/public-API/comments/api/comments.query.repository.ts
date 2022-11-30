import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  CommentDBType,
  ViewAllCommentsForAllPostsWithPaginationType,
  ViewCommentsTypeWithPagination,
  ViewCommentType,
} from '../types/comments.types';
import { mapComment } from '../helpers/mapCommentDBTypeToViewModel';
import { QueryPostDto } from '../../posts/api/models/query-post.dto';
import { LikeDBType } from '../../likes/types/likes.types';
import { QueryBlogDto } from '../../blogs/api/models/query-blog.dto';
import { mapCommentDBTypeToAllCommentForAllPosts } from '../helpers/mapCommentDBTypeToAllCommentForAllPosts';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @Inject('COMMENT_MODEL')
    private readonly commentModel: Model<CommentDBType>,
    @Inject('LIKES_MODEL')
    private readonly likesModel: Model<LikeDBType>,
  ) {}

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<ViewCommentType | null> {
    if (commentId.length !== 24) return null;
    const commentDBType = await this.commentModel.findOne({
      _id: commentId,
      isBanned: false,
    });
    if (!commentDBType) return null;

    const commentViewType = mapComment(commentDBType);

    let myLikeOrDislike: LikeDBType | null = null;

    if (userId) {
      myLikeOrDislike = await this.likesModel
        .findOne({
          idObject: commentId,
          postOrComment: 'comment',
          userId: userId,
          isBanned: false,
        })
        .lean();
    }

    if (myLikeOrDislike)
      commentViewType.likesInfo.myStatus = myLikeOrDislike.status;

    return commentViewType;
  }

  async getCommentsByPostId(
    postId: string,
    query: QueryPostDto,
    userId?: string,
  ): Promise<ViewCommentsTypeWithPagination> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    let myLikeOrDislike: LikeDBType | null = null;

    const itemsDBType = await this.commentModel
      .find({ postId: postId, isBanned: false })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();

    if (itemsDBType.length === 0) return null;

    const itemsWithoutMyLike = itemsDBType.map((i) => mapComment(i));

    const items = await Promise.all(
      itemsWithoutMyLike.map(async (i) => {
        if (!userId) return i;

        if (userId) {
          myLikeOrDislike = await this.likesModel
            .findOne({
              idObject: i.id,
              postOrComment: 'comment',
              userId: userId,
              isBanned: false,
            })
            .lean();
        }

        if (myLikeOrDislike) i.likesInfo.myStatus = myLikeOrDislike.status;

        return i;
      }),
    );

    const totalCount = await this.commentModel.count({
      postId: postId,
      isBanned: false,
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items,
    };
  }

  async getAllCommentsForAllPostsCurrentUser(
    query: QueryBlogDto,
    userId: string,
  ): Promise<ViewAllCommentsForAllPostsWithPaginationType> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || 'createdAt';
    const sortDirection: 'asc' | 'desc' = query.sortDirection || 'desc';

    const itemsDBType = await this.commentModel
      .find({ 'postInfo.postOwnerUserId': userId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();

    if (itemsDBType.length === 0) return null;

    const itemsWithoutMyLike = itemsDBType.map((i) =>
      mapCommentDBTypeToAllCommentForAllPosts(i),
    );

    const items = await Promise.all(
      itemsWithoutMyLike.map(async (i) => {
        let myLikeOrDislike: LikeDBType | null = null;

        if (!userId) return i;

        if (userId) {
          myLikeOrDislike = await this.likesModel
            .findOne({
              idObject: i.id,
              postOrComment: 'comment',
              userId: userId,
            })
            .lean();
        }

        if (myLikeOrDislike) i.likesInfo.myStatus = myLikeOrDislike.status;

        return i;
      }),
    );

    const totalCount = await this.commentModel.count({
      'postInfo.postOwnerUserId': userId,
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }
}

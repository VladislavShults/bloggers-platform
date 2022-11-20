import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  CommentDBType,
  ViewCommentsTypeWithPagination,
  ViewCommentType,
} from '../types/comments.types';
import { mapComment } from '../helpers/mapCommentDBTypeToViewModel';
import { QueryPostDto } from '../../posts/api/models/query-post.dto';
import { LikeDBType } from '../../likes/types/likes.types';
import { mapCommentWithLookup } from '../helpers/mapCommentLookupToView';

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
    const commentDBType = await this.commentModel.findById(commentId);
    if (!commentDBType) return null;

    const commentViewType = mapComment(commentDBType);

    let myLikeOrDislike: LikeDBType | null = null;

    if (userId) {
      myLikeOrDislike = await this.likesModel
        .findOne({
          idObject: commentId,
          postOrComment: 'comment',
          userId: userId,
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

    let sortDirectionToNumber: 1 | -1;
    if (sortDirection === 'desc') sortDirectionToNumber = -1;
    else sortDirectionToNumber = 1;

    // const itemsDBType = await this.commentModel
    //   .find({ postId: postId })
    //   .skip((pageNumber - 1) * pageSize)
    //   .limit(pageSize)
    //   .sort([[sortBy, sortDirection]])
    //   .lean();

    const itemsDBTypeWithLookup = await this.commentModel.aggregate([
      { $match: { postId: postId } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
      { $sort: { [sortBy]: sortDirectionToNumber } },
      {
        $lookup: {
          from: 'likes',
          localField: 'userId',
          foreignField: 'userId',
          as: 'likes',
        },
      },
    ]);

    if (itemsDBTypeWithLookup.length === 0) return null;

    const items = itemsDBTypeWithLookup.map((i) => mapCommentWithLookup(i));

    return {
      pagesCount: Math.ceil(
        (await this.commentModel.count({ postId: postId })) / pageSize,
      ),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: await this.commentModel.count({ postId: postId }),
      items,
    };
  }
}

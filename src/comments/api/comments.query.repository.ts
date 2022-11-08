import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommentDBType, ViewCommentType } from '../types/comments.types';
import { mapComment } from '../helpers/mapCommentDBTypeToViewModel';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @Inject('COMMENT_MODEL')
    private readonly commentModel: Model<CommentDBType>,
  ) {}

  async getCommentById(commentId: string): Promise<ViewCommentType> {
    const commentDBType = await this.commentModel.findById(commentId);
    const comment = mapComment(commentDBType);
    return comment;
  }
}

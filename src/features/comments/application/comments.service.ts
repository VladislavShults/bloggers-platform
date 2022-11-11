import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CreateCommentDto } from '../api/models/create-comment.dto';
import { CommentDBType } from '../types/comments.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createCommentByPost(
    postId: string,
    inputModel: CreateCommentDto,
  ): Promise<ObjectId> {
    const comment: CommentDBType = {
      _id: new ObjectId(),
      content: inputModel.content,
      userId: 'random',
      userLogin: 'random',
      createdAt: new Date(),
      postId: postId,
      likesCount: 0,
      dislikesCount: 0,
    };

    await this.commentsRepository.createComment(comment);
    return comment._id;
  }
}

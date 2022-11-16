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
    const comment: Omit<CommentDBType, '_id'> = {
      content: inputModel.content,
      userId: 'random',
      userLogin: 'random',
      createdAt: new Date(),
      postId: postId,
      likesCount: 0,
      dislikesCount: 0,
    };

    return await this.commentsRepository.createComment(comment);
  }

  async deleteCommentById(commentId: string): Promise<boolean> {
    return await this.commentsRepository.deleteCommentById(commentId);
  }

  async updateComment(commentId: string, content: string) {
    const comment = await this.commentsRepository.getCommentById(commentId);
    if (!comment) return null;
    comment.content = content;
    return await this.commentsRepository.updateComment(comment);
  }

  async makeLikeOrUnlike(
    postId: string,
    likeStatus: 'Like' | 'Dislike' | 'None',
  ) {
    if (postId.length !== 24) return;
  }
}

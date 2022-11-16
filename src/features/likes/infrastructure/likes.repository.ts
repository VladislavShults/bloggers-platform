import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostDBType } from '../../posts/types/posts.types';
import { LikeDBType } from '../types/likes.types';

@Injectable()
export class LikesRepository {
  constructor(
    @Inject('LIKES_MODEL')
    private readonly likesModel: Model<LikeDBType>,
  ) {}
  async findLikeByUserIdAndPostId(userId: string, postId: string) {
    const like = await this.likesModel.findOne({
      idObject: postId,
      userId: userId,
      postOrComment: 'post',
    });
    if (!like) return null;
    return like;
  }

  async saveLikeOrUnlike(likeOrUnlike: Omit<LikeDBType, '_id'>) {
    await this.likesModel.create(likeOrUnlike);
  }

  async updateLike(likeInDb) {
    await likeInDb.save();
  }
}

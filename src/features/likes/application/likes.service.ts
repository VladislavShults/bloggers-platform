import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/likes.repository';
import { LikeDBType } from '../types/likes.types';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return await this.likesRepository.findLikeByUserIdAndPostId(userId, postId);
  }

  async saveLikeOrUnlike(likeOrUnlike: Omit<LikeDBType, '_id'>) {
    await this.likesRepository.saveLikeOrUnlike(likeOrUnlike);
  }

  async updateLike(likeInDb) {
    await this.likesRepository.updateLike(likeInDb);
  }
}

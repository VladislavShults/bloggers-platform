import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsQueryRepository } from '../api/comments.query.repository';

@Injectable()
export class CheckCommentInDB implements CanActivate {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const params = request.params;
    if (params.commentId.length !== 24)
      throw new HttpException('COMMENT NOT FOUND', HttpStatus.NOT_FOUND);
    const post = await this.commentsQueryRepository.getCommentById(
      params.commentId,
    );
    if (!post) throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    return true;
  }
}

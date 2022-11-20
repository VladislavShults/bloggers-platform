import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsQueryRepository } from '../api/posts.query.repository';

@Injectable()
export class CheckPostInDBGuard implements CanActivate {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const params = request.params;
    if (params.postId.length !== 24)
      throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    const post = await this.postsQueryRepository.getPostById(params.postId);
    if (!post) throw new HttpException('POST NOT FOUND', HttpStatus.NOT_FOUND);
    return true;
  }
}

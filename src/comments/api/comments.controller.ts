import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { URIParamCommentDto } from './models/URIParam-comment.dto';
import { ViewCommentType } from '../types/comments.types';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get(':commentId')
  async getCommentById(
    @Param() params: URIParamCommentDto,
  ): Promise<ViewCommentType> {
    const comment = await this.commentsQueryRepository.getCommentById(
      params.commentId,
    );
    if (!comment)
      throw new HttpException('COMMENT NOT FOUND', HttpStatus.NOT_FOUND);
    return comment;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments.query.repository';
import { URIParamCommentDto } from './models/URIParam-comment.dto';
import { ViewCommentType } from '../types/comments.types';
import { URIParamBlogDto } from '../../blogs/api/models/URIParam-blog.dto';
import { UpdateBlogDto } from '../../blogs/api/models/update-blog.dto';
import { UpdateCommentDto } from './models/update-comment.dto';

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

  @Delete(':commentId')
  @HttpCode(204)
  async deleteCommentById(
    @Param() params: URIParamCommentDto,
  ): Promise<HttpStatus> {
    const deletedComment = await this.commentsService.deleteCommentById(
      params.commentId,
    );
    if (!deletedComment)
      throw new HttpException('COMMENT NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }

  @Put(':commentId')
  @HttpCode(204)
  async updateCommentById(
    @Param() params: URIParamCommentDto,
    @Body() updateCommentDTO: UpdateCommentDto,
  ): Promise<HttpStatus> {
    const updateComment = await this.commentsService.updateComment(
      params.commentId,
      updateCommentDTO.content,
    );
    if (!updateComment)
      throw new HttpException('COMMENT NOT FOUND', HttpStatus.NOT_FOUND);
    return;
  }
}

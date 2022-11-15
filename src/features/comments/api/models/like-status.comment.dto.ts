import { IsString, Length } from 'class-validator';

export class LikeStatusCommentDto {
  @IsString()
  @Length(4, 9)
  likeStatus: 'Like' | 'Dislike' | 'None';
}

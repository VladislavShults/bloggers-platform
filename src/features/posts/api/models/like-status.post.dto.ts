import { IsString, Length } from 'class-validator';

export class LikeStatusPostDto {
  @IsString()
  @Length(4, 9)
  likeStatus: 'Like' | 'Dislike' | 'None';
}

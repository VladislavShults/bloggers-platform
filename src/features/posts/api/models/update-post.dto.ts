import { IsString, Length } from 'class-validator';
import { BlogId } from '../../validation/blogId-validation';

export class UpdatePostDto {
  @IsString()
  @Length(0, 30)
  title: string;

  @IsString()
  @Length(0, 100)
  shortDescription: string;

  @IsString()
  @Length(0, 1000)
  content: string;

  @IsString()
  @BlogId()
  blogId: string;
}

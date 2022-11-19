import { IsString, IsUrl, Length } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @Length(0, 15)
  name: string;

  @IsUrl()
  @Length(0, 100)
  websiteUrl: string;
}

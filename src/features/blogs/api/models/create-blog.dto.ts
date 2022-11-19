import { IsString, IsUrl, Length, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @Length(3, 15)
  name: string;

  @IsString()
  @Length(3, 500)
  description: string;

  @IsUrl()
  @MaxLength(100)
  websiteUrl: string;
}

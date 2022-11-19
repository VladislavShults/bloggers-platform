import { IsString, IsUrl, Length, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @Length(0, 15)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsUrl()
  @MaxLength(100)
  websiteUrl: string;
}

import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @Length(3, 15)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsUrl()
  @MaxLength(100)
  websiteUrl: string;
}

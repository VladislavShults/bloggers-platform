import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class BanBlogDto {
  @IsBoolean()
  @Type(() => Boolean)
  isBanned: boolean;
}

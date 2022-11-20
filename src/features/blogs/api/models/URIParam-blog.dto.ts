import { Validate } from 'class-validator';
import { BlogIdValidation } from '../../../posts/validation/blogId-validation';

export class URIParamBlogDto {
  // @Validate(BlogIdValidation)
  blogId: string;
}

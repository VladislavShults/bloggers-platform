import { Controller, Get } from '@nestjs/common';

@Controller('blogs')
export class BlogsController {
  @Get()
  getBlogs() {
    return 'Blogs';
  }
}

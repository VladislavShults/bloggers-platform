import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BlogsController } from '../blogs/api/blogs.controller';
import { blogsMongooseConnection } from '../blogs/blogsMongooseConnection';
import { BlogsService } from '../blogs/application/blogs.service';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../blogs/api/blogs.query.repository';
import { PostsController } from '../posts/api/posts.controller';
import { PostsService } from '../posts/application/posts.service';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '../posts/api/posts.query.repository';
import { postMongooseConnection } from '../posts/postMongooseConnection';

@Module({
  imports: [DatabaseModule],
  controllers: [BlogsController, PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    ...blogsMongooseConnection,
    ...postMongooseConnection,
  ],
})
export class BlogsPlatformModule {}

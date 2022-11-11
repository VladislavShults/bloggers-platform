import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BlogsController } from '../features/blogs/api/blogs.controller';
import { blogsMongooseConnection } from '../features/blogs/blogsMongooseConnection';
import { BlogsService } from '../features/blogs/application/blogs.service';
import { BlogsRepository } from '../features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../features/blogs/api/blogs.query.repository';
import { PostsController } from '../features/posts/api/posts.controller';
import { PostsService } from '../features/posts/application/posts.service';
import { PostsRepository } from '../features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '../features/posts/api/posts.query.repository';
import { postMongooseConnection } from '../features/posts/postMongooseConnection';
import { commentsMongooseConnection } from '../features/comments/commentsMongooseConnection';
import { CommentsService } from '../features/comments/application/comments.service';
import { CommentsRepository } from '../features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '../features/comments/api/comments.query.repository';
import { CommentsController } from '../features/comments/api/comments.controller';
import { TestingController } from '../features/testing/testing.controller';
import { usersMongooseConnection } from '../features/users/usersMongooseConnection';

@Module({
  imports: [DatabaseModule],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    TestingController,
  ],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    ...blogsMongooseConnection,
    ...postMongooseConnection,
    ...commentsMongooseConnection,
    ...usersMongooseConnection,
  ],
})
export class BlogsPlatformModule {}

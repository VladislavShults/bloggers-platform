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
import { commentsMongooseConnection } from '../comments/commentsMongooseConnection';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsRepository } from '../comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '../comments/api/comments.query.repository';
import { CommentsController } from '../comments/api/comments.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BlogsController, PostsController, CommentsController],
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
  ],
})
export class BlogsPlatformModule {}

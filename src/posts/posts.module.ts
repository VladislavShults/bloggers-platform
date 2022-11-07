import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { postsProviders } from './posts.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    // PostsQueryRepository,
    ...postsProviders,
  ],
})
export class PostsModule {}

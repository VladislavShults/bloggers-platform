import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BlogsController } from './api/blogs.controller';
import { blogsProviders } from './blogs.providers';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './api/blogs.query.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    ...blogsProviders,
  ],
})
export class BlogsModule {}

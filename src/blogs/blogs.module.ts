import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BlogsController],
  providers: [],
})
export class BlogsModule {}

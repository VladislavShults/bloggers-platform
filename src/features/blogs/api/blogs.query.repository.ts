import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  BlogDBType,
  ViewBlogType,
  ViewBlogsTypeWithPagination,
} from '../types/blogs.types';
import { mapBlog } from '../helpers/mapBlogDBToViewModel';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
  ) {}

  async findBlogById(blogId: string): Promise<ViewBlogType | null> {
    const blogDBType = await this.blogModel.findById(blogId);
    if (!blogDBType) return null;
    const blog: ViewBlogType = mapBlog(blogDBType);
    return blog;
  }

  async getBlogs(
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<ViewBlogsTypeWithPagination> {
    const itemsDBType: BlogDBType[] = await this.blogModel
      .find({ name: { $regex: searchNameTerm, $options: 'i' } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();
    const items: ViewBlogType[] = itemsDBType.map((i) => mapBlog(i));
    return {
      pagesCount: Math.ceil(
        (await this.blogModel.count({ name: { $regex: searchNameTerm } })) /
          pageSize,
      ),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: await this.blogModel.count({
        name: { $regex: searchNameTerm },
      }),
      items,
    };
  }
}

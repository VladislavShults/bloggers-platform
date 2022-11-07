import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  BlogDBType,
  ViewBlogType,
  ViewBlogTypeWithPagination,
} from '../types/blogs.types';
import { mapBlog } from '../helpers/mapBlogDBToViewModel';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @Inject('BLOG_MODEL') private readonly blogModel: Model<BlogDBType>,
  ) {}

  async findBlogById(blogId: string): Promise<ViewBlogType> {
    const blogDBType = await this.blogModel.findById(blogId);
    const blog: ViewBlogType = mapBlog(blogDBType);
    return blog;
  }

  async getBlogs(
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<ViewBlogTypeWithPagination> {
    const itemsDBType: BlogDBType[] = await this.blogModel
      .find({ name: { $regex: searchNameTerm } })
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
  async getLoginBloggerByBlogId(blogId: string): Promise<string> {
    const blog = await this.blogModel.findById(blogId);
    const login = blog.name;
    return login;
  }
}

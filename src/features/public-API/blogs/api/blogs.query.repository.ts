import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  BlogDBType,
  BlogDBTypeWithoutBlogOwner,
  ViewBlogsTypeWithPagination,
  ViewBlogType,
} from '../types/blogs.types';
import { mapBlog } from '../helpers/mapBlogDBToViewModel';
import { mapBlogById } from '../helpers/mapBlogByIdToViewModel';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @Inject('BLOG_MODEL')
    private readonly blogModel: Model<BlogDBType>,
  ) {}

  async findBlogById(blogId: string): Promise<ViewBlogType | null> {
    if (blogId.length !== 24) return null;
    const blogDBType = await this.blogModel.findById(blogId);
    if (!blogDBType) return null;
    return mapBlogById(blogDBType);
  }

  async getBlogs(
    searchNameTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<ViewBlogsTypeWithPagination> {
    const itemsDBType: BlogDBTypeWithoutBlogOwner[] = await this.blogModel
      .find({ name: { $regex: searchNameTerm, $options: 'i' } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort([[sortBy, sortDirection]])
      .lean();
    const items: ViewBlogType[] = itemsDBType.map((i) => mapBlog(i));
    return {
      pagesCount: Math.ceil(
        (await this.blogModel.count({
          name: { $regex: searchNameTerm, $options: 'i' },
        })) / pageSize,
      ),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: await this.blogModel.count({
        name: { $regex: searchNameTerm, $options: 'i' },
      }),
      items,
    };
  }

  async getLoginBloggerByBlogId(blogId: string): Promise<string> {
    const blog = await this.blogModel.findById(blogId);
    return blog.name;
  }
}

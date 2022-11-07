import { BlogDBType, ViewBlogType } from '../types/blogs.types';

export const mapBlog = (blog: BlogDBType): ViewBlogType => ({
  id: blog._id.toString(),
  name: blog.name,
  youtubeUrl: blog.youtubeUrl,
  createdAt: blog.createdAt,
});

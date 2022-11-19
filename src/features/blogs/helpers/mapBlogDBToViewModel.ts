import { BlogDBType, ViewBlogType } from '../types/blogs.types';

export const mapBlog = (blog: BlogDBType): ViewBlogType => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
});

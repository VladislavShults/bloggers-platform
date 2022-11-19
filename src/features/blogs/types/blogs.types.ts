import { ObjectId } from 'mongodb';

export type BlogDBType = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};

export type ViewBlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};

export type ViewBlogByIdType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};

export type ViewBlogsTypeWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewBlogType[];
};

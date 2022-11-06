import { ObjectId } from 'mongodb';

export type BlogDBType = {
  _id: ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
};

export type ViewBlogType = {
  id: string;
  name: string;
  youtubeUrl: string;
  createdAt: Date;
};

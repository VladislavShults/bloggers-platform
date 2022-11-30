import mongoose from 'mongoose';
import { BlogDBType } from '../types/blogs.types';

export const BlogSchema = new mongoose.Schema<Omit<BlogDBType, '_id'>>(
  {
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: Date,
    blogOwnerInfo: {
      userId: String,
      userLogin: String,
    },
    isBanned: Boolean,
    bannedUsers: [String],
  },
  {
    versionKey: false,
  },
);

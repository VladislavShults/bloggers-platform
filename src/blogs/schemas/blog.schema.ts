import mongoose from 'mongoose';
import { BlogDBType } from '../types/blogs.types';
import { ObjectId } from 'mongodb';

export const BlogSchema = new mongoose.Schema<BlogDBType>(
  {
    _id: ObjectId,
    name: String,
    youtubeUrl: String,
    createdAt: Date,
  },
  {
    versionKey: false,
  },
);

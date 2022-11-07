import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { PostDBType } from '../types/posts.types';

export const PostSchema = new mongoose.Schema<PostDBType>(
  {
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: Date,
    likesCount: Number,
    dislikesCount: Number,
  },
  {
    versionKey: false,
  },
);

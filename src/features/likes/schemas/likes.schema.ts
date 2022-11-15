import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { LikeDBType } from '../types/likes.types';

export const LikesSchema = new mongoose.Schema<LikeDBType>(
  {
    _id: ObjectId,
    idObject: ObjectId,
    addedAt: Date,
    userId: ObjectId,
    login: String,
    status: String,
    postOrComment: String,
  },
  {
    versionKey: false,
  },
);

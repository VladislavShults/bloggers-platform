import mongoose from 'mongoose';
import { UserDBType } from '../types/users.types';
import { ObjectId } from 'mongodb';

export const UserSchema = new mongoose.Schema<UserDBType>(
  {
    login: String,
    email: String,
    createdAt: Date,
    passwordHash: String,
    emailConfirmation: {
      confirmationCode: String,
      expirationDate: Date,
      isConfirmed: Boolean,
    },
    banInfo: {
      isBanned: Boolean,
      banDate: Date,
      banReason: String,
    },
  },
  {
    versionKey: false,
  },
);

import mongoose from 'mongoose';
import { UserDBType } from '../types/users.types';
import { ObjectId } from 'mongodb';

export const UserSchema = new mongoose.Schema<UserDBType>(
  {
    _id: ObjectId,
    accountData: {
      userName: String,
      email: String,
      passwordHash: String,
      createdAt: Date,
    },
    emailConfirmation: {
      confirmationCode: String,
      expirationDate: Date,
      isConfirmed: Boolean,
    },
  },
  {
    versionKey: false,
  },
);

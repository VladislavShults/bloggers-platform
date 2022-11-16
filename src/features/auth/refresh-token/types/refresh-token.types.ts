import { ObjectId } from 'mongodb';

export type RefreshTokenDBType = {
  _id: ObjectId;
  issuedAt: string;
  deviceId: string;
  ip: string;
  deviceName: string;
  userId: string;
  expiresAt: string;
  lastActiveDate: Date;
};

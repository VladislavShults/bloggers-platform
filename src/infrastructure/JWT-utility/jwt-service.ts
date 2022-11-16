import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export class JwtService {
  async createJWT(userId: string, expiresTime: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: expiresTime,
    });
  }

  async createRefreshJWT(
    userId: string,
    deviceId: string,
    expiresTime: string,
  ) {
    return jwt.sign({ userId, deviceId }, process.env.JWT_SECRET, {
      expiresIn: expiresTime,
    });
  }

  async extractUserIdFromToken(token: string): Promise<ObjectId | null> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }
}

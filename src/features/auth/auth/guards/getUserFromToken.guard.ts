import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtUtility } from '../../../../JWT-utility/jwt-utility';
import { Model } from 'mongoose';
import { UserDBType } from '../../../users/types/users.types';

@Injectable()
export class GetUserFromTokenGuard implements CanActivate {
  constructor(
    private readonly jwtUtility: JwtUtility,
    @Inject('USER_MODEL') private readonly userModel: Model<UserDBType>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return true;
    const token: string = request.headers.authorization.split(' ')[1];
    const userId = await this.jwtUtility.extractUserIdFromToken(token);
    if (!userId) return true;
    const user = await this.userModel.findById(userId);
    if (!user) return true;
    request.user = user;
    return true;
  }
}

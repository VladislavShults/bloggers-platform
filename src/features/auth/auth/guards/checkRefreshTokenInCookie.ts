import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { AuthService } from '../application/auth.service';
import { RefreshTokenDBType } from '../../refresh-token/types/refresh-token.types';

@Injectable()
export class CheckRefreshTokenInCookie implements CanActivate {
  constructor(
    @Inject('REFRESH_TOKEN_MODEL')
    private readonly refreshTokenModel: Model<RefreshTokenDBType>,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken || null;
    const tokenIsValid = await this.authService.checkRefreshTokenForValid(
      refreshToken,
    );
    if (!tokenIsValid)
      throw new HttpException('Token invalid', HttpStatus.UNAUTHORIZED);
    return true;
  }
}

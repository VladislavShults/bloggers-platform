import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDBType } from '../../../users/types/users.types';
import { Request } from 'express';
import { AuthService } from '../application/auth.service';

@Injectable()
export class CheckUserAndHisPasswordInDB implements CanActivate {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<UserDBType>,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user: UserDBType = await this.userModel
      .find({ login: request.body.login })
      .lean();
    if (!user) throw new HttpException('', HttpStatus.UNAUTHORIZED);

    const passwordHash = await this.authService.generateHash(
      request.body.password,
    );
    if (user.passwordHash !== passwordHash)
      throw new HttpException('', HttpStatus.UNAUTHORIZED);

    return true;
  }
}

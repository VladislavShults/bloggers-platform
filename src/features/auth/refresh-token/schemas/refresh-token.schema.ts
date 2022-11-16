import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RefreshTokenSchema = HydratedDocument<Comment>;

@Schema({ versionKey: false })
export class Comment {
  @Prop()
  issuedAt: string;

  @Prop()
  deviceId: string;

  @Prop()
  ip: string;

  @Prop()
  deviceName: string;

  @Prop()
  userId: string;

  @Prop()
  expiresAt: string;

  @Prop()
  lastActiveDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(Comment);

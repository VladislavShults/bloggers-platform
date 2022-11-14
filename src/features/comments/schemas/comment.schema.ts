import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentSchema = HydratedDocument<Comment>;

@Schema({ versionKey: false })
export class Comment {
  @Prop()
  content: string;

  @Prop()
  userId: string;

  @Prop()
  userLogin: string;

  @Prop()
  createdAt: Date;

  @Prop()
  postId: string;

  @Prop()
  likesCount: number;

  @Prop()
  dislikesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

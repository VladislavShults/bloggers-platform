import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { PostSchema } from '../../posts/schemas/post.schema';

export type CommentSchema = HydratedDocument<Comment>;

@Schema({ versionKey: false })
export class Comment {
  @Prop()
  _id: ObjectId;

  @Prop({ type: String })
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

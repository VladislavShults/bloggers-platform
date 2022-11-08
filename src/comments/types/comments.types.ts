import { ObjectId } from 'mongodb';

export type CommentDBType = {
  _id: ObjectId;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
  postId: string;
  likesCount: number;
  dislikesCount: number;
};

export type ViewCommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
  };
};

import { ObjectId } from 'mongodb';
import { LikeType } from '../../likes/types/likes.types';

export type CommentDBType = {
  _id: ObjectId;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: Date;
  postId: string;
  likesCount: number;
  dislikesCount: number;
  isBanned: boolean;
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
    myStatus: LikeType;
  };
};

export type ViewCommentsTypeWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewCommentType[];
};

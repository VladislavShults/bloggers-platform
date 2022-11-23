import { ObjectId } from 'mongodb';
import { LikeDBType, LikeType } from '../../likes/types/likes.types';

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
    myStatus: LikeType;
  };
};

type CommentLookupType = {
  likes: LikeDBType;
};

export type CommentDBTypeWithLookup = CommentDBType & CommentLookupType;

export type ViewCommentsTypeWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewCommentType[];
};

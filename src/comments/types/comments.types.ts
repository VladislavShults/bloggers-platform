import { ObjectId } from 'mongodb';
import { ViewPostType } from '../../posts/types/posts.types';

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

export type ViewCommentsTypeWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewCommentType[];
};

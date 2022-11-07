import { ObjectId } from 'mongodb';

export type PostDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  likesCount: number;
  dislikesCount: number;
};

type NewestLikesType = {
  readonly addedAt: Date;
  readonly userId: string;
  readonly login: string;
};

type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
  newestLikes: NewestLikesType[];
};

export type ViewPostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfoType;
};

export type ViewPostsTypeWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewPostType[];
};
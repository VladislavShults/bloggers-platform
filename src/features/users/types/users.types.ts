import { ObjectId } from 'mongodb';

export type UserDBType = {
  _id: ObjectId;
  accountData: {
    userName: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

export type ViewUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};

export type ViewUsersTypeWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ViewUserType[];
};

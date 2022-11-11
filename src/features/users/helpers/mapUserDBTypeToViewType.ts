import { UserDBType, ViewUserType } from '../types/users.types';

export const mapUserDBTypeToViewType = (user: UserDBType): ViewUserType => ({
  id: user._id.toString(),
  login: user.accountData.userName,
  email: user.accountData.email,
  createdAt: user.accountData.createdAt,
});

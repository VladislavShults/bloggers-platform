import {
  CommentDBTypeWithLookup,
  ViewCommentType,
} from '../types/comments.types';

export const mapCommentWithLookup = (
  comment: CommentDBTypeWithLookup,
): ViewCommentType => ({
  id: comment._id.toString(),
  content: comment.content,
  userId: comment.userId,
  userLogin: comment.userLogin,
  createdAt: comment.createdAt,
  likesInfo: {
    likesCount: comment.likesCount,
    dislikesCount: comment.dislikesCount,
    myStatus: comment.likes.status || 'None',
  },
});

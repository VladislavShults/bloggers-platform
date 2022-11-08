import { PostDBType, ViewPostWithoutLikesType } from '../types/posts.types';

export const mapPostsDBToViewModelWithoutLikes = (
  post: PostDBType,
): ViewPostWithoutLikesType => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
});

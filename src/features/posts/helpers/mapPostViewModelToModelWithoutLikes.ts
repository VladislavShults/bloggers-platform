import { ViewPostType, ViewPostWithoutLikesType } from '../types/posts.types';

export const mapPostViewModelToModelWithoutLikes = (
  post: ViewPostType,
): ViewPostWithoutLikesType => ({
  id: post.id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
});

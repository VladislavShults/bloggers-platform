import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostDto } from '../api/models/create-post.dto';
import { ObjectId } from 'mongodb';
import { PostDBType } from '../types/posts.types';
import { UpdatePostDto } from '../api/models/update-post.dto';
import { UserDBType } from '../../users/types/users.types';
import { LikesService } from '../../likes/application/likes.service';
import { LikeDBType, LikeType } from '../../likes/types/likes.types';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly likesService: LikesService,
    private readonly blogsRepository: BlogsRepository, // private readonly usersService: UsersService,
  ) {}

  async createPost(createPostDTO: CreatePostDto): Promise<ObjectId> {
    const post: Omit<PostDBType, '_id'> = {
      title: createPostDTO.title,
      shortDescription: createPostDTO.shortDescription,
      content: createPostDTO.content,
      blogId: createPostDTO.blogId,
      blogName: await this.blogsRepository.getLoginBloggerByBlogId(
        createPostDTO.blogId,
      ),
      createdAt: new Date(),
      likesCount: 0,
      dislikesCount: 0,
    };
    return await this.postsRepository.createPost(post);
  }

  async updatePost(
    postId: string,
    inputModel: UpdatePostDto,
  ): Promise<boolean> {
    this.verifyPostId(postId);
    const post = await this.postsRepository.getPostById(postId);
    if (!post) return false;
    post.title = inputModel.title;
    post.shortDescription = inputModel.shortDescription;
    post.content = inputModel.content;
    return await this.postsRepository.updatePost(post);
  }

  async deletePostById(postId: string): Promise<boolean> {
    this.verifyPostId(postId);
    return await this.postsRepository.deletePostById(postId);
  }

  private verifyPostId = (postId: string): boolean => {
    return postId.length === 24;
  };

  async makeLikeOrUnlike(
    postId: string,
    user,
    likeStatus: LikeType,
  ): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) return false;
    if (likeStatus === 'Like') {
      return await this.makeLike(postId, user);
    }
    if (likeStatus === 'Dislike') {
      return await this.makeDislike(postId, user);
    }
    if (likeStatus === 'None') {
      return await this.resetLike(postId, user);
    }
    return true;
  }

  async makeLike(postId: string, user): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    const myLike = await this.likesService.findLikeByUserIdAndPostId(
      user._id.toString(),
      postId,
    );

    let myStatus: string;
    if (!myLike) myStatus = null;
    else myStatus = myLike.status;

    if (post && myStatus === 'Dislike') {
      post.likesCount += 1;
      post.dislikesCount -= 1;
      myLike.addedAt = new Date();
      myLike.status = 'Like';
      await this.postsRepository.updatePost(post);
      await this.likesService.updateLike(myLike);
      return true;
    }
    if (post && myStatus === null) {
      post.likesCount += 1;
      const like: Omit<LikeDBType, '_id'> = {
        idObject: post._id,
        userId: user._id,
        login: user.login,
        addedAt: new Date(),
        status: 'Like',
        postOrComment: 'post',
      };
      await this.postsRepository.updatePost(post);
      await this.likesService.saveLikeOrUnlike(like);
      return true;
    }
    if (post && myStatus === 'None') {
      post.likesCount += 1;
      myLike.status = 'Like';
      myLike.addedAt = new Date();
      await this.postsRepository.updatePost(post);
      await this.likesService.updateLike(myLike);
      return true;
    }
    return true;
  }

  async makeDislike(postId: string, user): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    const myLike = await this.likesService.findLikeByUserIdAndPostId(
      user._id.toString(),
      postId,
    );

    let myStatus: string;
    if (!myLike) myStatus = null;
    else myStatus = myLike.status;

    if (post && myStatus === 'Like') {
      post.likesCount -= 1;
      post.dislikesCount += 1;
      myLike.addedAt = new Date();
      myLike.status = 'Dislike';
      await this.postsRepository.updatePost(post);
      await this.likesService.updateLike(myLike);
      return true;
    }
    if (post && myStatus === null) {
      post.dislikesCount += 1;
      const like: Omit<LikeDBType, '_id'> = {
        idObject: post._id,
        userId: user._id,
        login: user.login,
        addedAt: new Date(),
        status: 'Dislike',
        postOrComment: 'post',
      };
      await this.postsRepository.updatePost(post);
      await this.likesService.saveLikeOrUnlike(like);
      return true;
    }
    if (post && myStatus === 'None') {
      post.dislikesCount += 1;
      myLike.status = 'Dislike';
      myLike.addedAt = new Date();
      await this.postsRepository.updatePost(post);
      await this.likesService.updateLike(myLike);
      return true;
    }
    return true;
  }

  async resetLike(postId: string, user): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    const myLike = await this.likesService.findLikeByUserIdAndPostId(
      user._id.toString(),
      postId,
    );

    let myStatus: string;
    if (!myLike) myStatus = null;
    else myStatus = myLike.status;

    if (post && myStatus === 'Like') {
      post.likesCount -= 1;
      myLike.addedAt = new Date();
      myLike.status = 'None';
      await this.postsRepository.updatePost(post);
      await this.likesService.updateLike(myLike);
      return true;
    }
    if (post && myStatus === 'Dislike') {
      post.dislikesCount -= 1;
      myLike.addedAt = new Date();
      myLike.status = 'None';
      await this.postsRepository.updatePost(post);
      await this.likesService.updateLike(myLike);
      return true;
    }
    return true;
  }
  // async makeLikeOrUnlike(
  //   postId: string,
  //   likeStatus: 'Like' | 'Dislike' | 'None',
  //   user: UserDBType,
  // ): Promise<boolean> {
  //   if (postId.length !== 24) return null;
  //
  //   const likeInDb = await this.likesService.findLikeByUserIdAndPostId(
  //     user._id.toString(),
  //     postId,
  //   );
  //   if (!likeInDb && likeStatus !== 'None') {
  //     const likeOrUnlike: Omit<LikeDBType, '_id'> = {
  //       idObject: new ObjectId(postId),
  //       addedAt: new Date(),
  //       userId: user._id,
  //       login: user.login,
  //       status: likeStatus,
  //       postOrComment: 'post',
  //     };
  //     await this.likesService.saveLikeOrUnlike(likeOrUnlike);
  //   }
  //
  //   if (likeInDb && likeInDb.status !== likeStatus) {
  //     likeInDb.status = likeStatus;
  //     likeInDb.addedAt = new Date();
  //     await this.likesService.updateLike(likeInDb);
  //   }
  //   return true;
  // }
}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BlogsController } from '../../features/blogs/api/blogs.controller';
import { blogsMongooseConnection } from '../../features/blogs/blogsMongooseConnection';
import { BlogsService } from '../../features/blogs/application/blogs.service';
import { BlogsRepository } from '../../features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '../../features/blogs/api/blogs.query.repository';
import { PostsController } from '../../features/posts/api/posts.controller';
import { PostsService } from '../../features/posts/application/posts.service';
import { PostsRepository } from '../../features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from '../../features/posts/api/posts.query.repository';
import { postMongooseConnection } from '../../features/posts/postMongooseConnection';
import { commentsMongooseConnection } from '../../features/comments/commentsMongooseConnection';
import { CommentsService } from '../../features/comments/application/comments.service';
import { CommentsRepository } from '../../features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '../../features/comments/api/comments.query.repository';
import { CommentsController } from '../../features/comments/api/comments.controller';
import { TestingController } from '../../features/testing/testing.controller';
import { usersMongooseConnection } from '../../features/users/usersMongooseConnection';
import { UsersService } from '../../features/users/application/users.servive';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../features/users/api/users.query.repository';
import { UsersController } from '../../features/users/api/users.controller';
import { likesMongooseConnection } from '../../features/likes/likesMongooseConnection';
import { AuthController } from '../../features/auth/api/auth.controller';
import { JwtService } from '../JWT-utility/jwt-service';
import { AuthService } from '../../features/auth/application/auth.service';
import { EmailService } from '../SMTP-adapter/email-service';
import { EmailManager } from '../SMTP-adapter/email-manager';
import { EmailAdapter } from '../SMTP-adapter/email-adapter';
import { devicesSecurityMongooseConnection } from '../../features/devices/devicesSecurityMongooseConnection';
import { AuthRepository } from '../../features/auth/infrastrucrure/auth.repository';
import { LikesService } from '../../features/likes/application/likes.service';
import { LikesRepository } from '../../features/likes/infrastructure/likes.repository';
import { BlogIdValidation } from '../../features/blogs/validation/blogId-validation';
import { ipRestrictionMongooseConnection } from '../ip-restriction/ipRestrictionMongooseConnection';
import { SecurityController } from '../../features/devices/api/devices.controller';
import { DevicesService } from '../../features/devices/application/devices.service';
import { DevicesQueryRepository } from '../../features/devices/api/devices.query.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
    AuthController,
    SecurityController,
  ],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    AuthRepository,
    JwtService,
    EmailService,
    EmailManager,
    EmailAdapter,
    LikesService,
    LikesRepository,
    BlogIdValidation,
    DevicesService,
    DevicesQueryRepository,
    ...blogsMongooseConnection,
    ...postMongooseConnection,
    ...commentsMongooseConnection,
    ...usersMongooseConnection,
    ...likesMongooseConnection,
    ...devicesSecurityMongooseConnection,
    ...ipRestrictionMongooseConnection,
  ],
})
export class BlogsPlatformModule {}

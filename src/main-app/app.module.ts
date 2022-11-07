import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsPlatformModule } from '../modules/blogsPlatformModule';

@Module({
  imports: [BlogsPlatformModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
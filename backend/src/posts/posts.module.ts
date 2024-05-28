import { Module } from '@nestjs/common';

import { POST, POSTSchema } from './schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: POST.name, schema: POSTSchema }])],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

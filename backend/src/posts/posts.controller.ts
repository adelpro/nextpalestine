import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Response } from 'express';

import { ErrorResponseDTO } from '@/auth/dtos/errorResponse.sto';
import { MePOSTsResponseDTO } from './dtos/mePOSTsResponse.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'get all posts',
    type: MePOSTsResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(@Res() response: Response) {
    const posts = await this.postsService.getAll();
    return response.status(HttpStatus.OK).json({
      posts,
    });
  }
}

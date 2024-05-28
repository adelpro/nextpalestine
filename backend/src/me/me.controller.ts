import {
  Controller,
  Get,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
  Patch,
  Body,
  HttpCode,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Put,
} from '@nestjs/common';
import { TrustedDevicesService } from '@/trusted-devices/trusted-devices.service';
import { AuthenticatedUser } from '../auth/types/authenticatedUser.type';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { Fingerprint } from '@/auth/decorators/fingerprint.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdtatePOSTObjectDTO } from '@/posts/dtos/updatePOST.dto';
import { ErrorResponseDTO } from '../auth/dtos/errorResponse.sto';
import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { UpdateUserDTO } from '../auth/dtos/updateUser.dto';
import { NewPOSTObjectDTO } from '@/posts/dtos/newPOST.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailerService } from '../mailer/mailer.service';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from '../users/users.service';
import { PostsService } from '@/posts/posts.service';
import { User } from '../users/schemas/user.schema';
import { POST } from '@/posts/schemas/post.schema';
import { AuthService } from '@/auth/auth.service';
import { MeService } from './me.service';
import { memoryStorage } from 'multer';
import { ObjectId } from 'mongoose';
import { Response } from 'express';

@UseGuards(JWTAuthGuard)
@Controller('me')
export class MeController {
  constructor(
    private readonly userService: UsersService,
    private readonly trustedDevice: TrustedDevicesService,
    readonly meService: MeService,
    private mailerService: MailerService,
    private authService: AuthService,
    private postsService: PostsService,
  ) {}

  @Get()
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'Get current user',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Error getting the current user',
    type: ErrorResponseDTO,
  })
  @ApiOperation({
    summary: 'Get the current user',
  })
  @HttpCode(HttpStatus.OK)
  async getMe(
    @CurrentUser('id') id: string,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<Omit<AuthenticatedUser, 'token'> | undefined> {
    const user = await this.userService.getUserById(id);
    const { email, name, about, role, isActivated, isTwoFAEnabled } = user;
    const isDeviceTrusted = await this.trustedDevice.isDeviceTrusted(id, fingerprint);
    const me: Omit<AuthenticatedUser, 'token'> & { isDeviceTrusted: boolean } = {
      id,
      email,
      name,
      about,
      role: role || 'user',
      isActivated: isActivated || false,
      isTwoFAEnabled: isTwoFAEnabled || false,
      isDeviceTrusted,
    };
    return me;
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'Current user updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Error updating the current user',
    type: ErrorResponseDTO,
  })
  @ApiOperation({
    summary: 'Update the current user',
  })
  async updateMe(@CurrentUser('id') id: string, @Body() updateUser: UpdateUserDTO): Promise<User | null> {
    const user = updateUser.user;
    const updatedUser = await this.userService.update(id, user);
    return updatedUser;
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user deleted successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDTO,
  })
  async deleteMe(@Res() response: Response, @CurrentUser('id') id: ObjectId): Promise<Response<User>> {
    const deletedUser = await this.userService.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedUser,
    });
  }

  @Get('account-activation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send account activation email',
  })
  @ApiResponse({
    status: 200,
    description: 'Activation email sent successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponseDTO,
  })
  async sendActivationEmail(@CurrentUser() currentUser: AuthenticatedUser): Promise<{ message: string }> {
    const user = await this.userService.getUserById(currentUser.id.toString());
    const { id, email, name } = user;
    await this.mailerService.sendActivationEmail(id, email, name);
    return { message: 'Activation email sent successfully' };
  }

  @Post('/account-activation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate the account using the token',
  })
  @ApiResponse({
    status: 200,
    description: 'Account activated successfully',
  })
  async activateMe(
    @Body('token') token: string,
    @Res() response: Response,
    @Fingerprint() fingerprint: FingerprintObj,
  ): Promise<Response<{ message: string }>> {
    const { message, cookieToken } = await this.meService.activateMe(token, fingerprint);
    return response
      .status(HttpStatus.OK)
      .cookie('token', cookieToken, this.authService.getCookieOptions())
      .json({ message });
  }

  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update password',
  })
  @ApiResponse({
    status: 200,
    description: 'Update password successfully',
  })
  async updatePassword(
    @Body() data: { oldPassword: string; newPassword: string },
    @Res() response: any,
    @CurrentUser('id') id: string,
  ): Promise<Response<{ message: string }>> {
    const { oldPassword, newPassword } = data;
    const message = await this.meService.updatePassword(id, oldPassword, newPassword);
    return response.status(HttpStatus.OK).json(message);
  }
  @Get('/profile-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get profile image',
  })
  @ApiResponse({
    status: 200,
    description: 'Getting profile image successfully',
  })
  async getProfileImage(@CurrentUser('id') id: string, @Res() res: Response) {
    const url: string = await this.meService.getProfileImage(id);
    return res.json({ url });
  }

  @Post('/profile-image')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'Current user profile image sent successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Error updating the current user profile image',
    type: ErrorResponseDTO,
  })
  @ApiOperation({
    summary: 'Post profile image for the current user',
  })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async uploadProfileImage(
    @UploadedFile()
    file: Express.Multer.File,
    @CurrentUser('id') id: string,
  ) {
    const result = await this.meService.uploadProfileImage(file, id);
    return { message: result };
  }

  @Delete('profile-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete profile image for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile image deleted successfully',
    type: () => ({ message: String }),
  })
  @ApiResponse({
    status: 404,
    description: 'Error deleting the current user profile image',
    type: ErrorResponseDTO,
  })
  async deleteProfileImage(@CurrentUser('id') id: string): Promise<{ message: string }> {
    const result = await this.meService.deleteProfileImage(id);
    return { message: result };
  }

  // me/posts
  // We are using /posts route to get all posts
  // and we are using /post/:id route to get a single post

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all current user posts',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all current user posts successfully',
    type: [POST],
  })
  @ApiResponse({
    status: 404,
    description: 'Error getting all current user posts',
    type: ErrorResponseDTO,
  })
  @Get('/posts')
  async getPosts(@CurrentUser('id') userId: string) {
    const posts = await this.postsService.getMePosts(userId);
    return posts;
  }

  @ApiOperation({ summary: 'Get current user post by id' })
  @ApiResponse({
    status: 200,
    description: 'get current user post by id',
    type: POST,
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/post/:id')
  async getPost(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const post = await this.postsService.getMePost(userId, id);
    return post;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add a new post for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Add a new post for the current user successfully',
    type: POST,
  })
  @ApiResponse({
    status: 404,
    description: 'Error adding a new post for the current user',
    type: ErrorResponseDTO,
  })
  @Post('/post')
  async meAddNewPost(@CurrentUser('id') userId: string, @Body() newPost: NewPOSTObjectDTO) {
    const post = await this.postsService.meAddNewPost(userId, newPost);
    return post;
  }

  @ApiOperation({ summary: 'Update current user post by id' })
  @ApiResponse({
    status: 200,
    description: 'Update post by id',
    type: POST,
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/post/:id')
  async update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() postObject: UpdtatePOSTObjectDTO) {
    const post = postObject.post;
    const updatedPost = await this.postsService.meUpdatePost(userId, id, post);
    return updatedPost;
  }

  @ApiOperation({ summary: 'Delete current user post by id' })
  @ApiResponse({
    status: 200,
    description: 'Delete current user post by id',
    type: POST,
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found',
    type: ErrorResponseDTO,
  })
  @HttpCode(HttpStatus.OK)
  @Delete('/post/:id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const deletedPost = await this.postsService.meDeletePost(userId, id);
    return deletedPost;
  }

  // Post Image

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Upload post image',
  })
  @ApiResponse({
    status: 200,
    description: 'Post image uploaded successfully',
    type: () => ({ postID: String, url: String }),
  })
  @ApiResponse({
    status: 404,
    description: 'Error uploading post image',
    type: ErrorResponseDTO,
  })
  @Post('/post-image')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async meAddPostImage(
    @UploadedFile()
    file: Express.Multer.File,
    @CurrentUser('id') userId: string,
    @Res() res: Response,
  ) {
    const imageData = await this.meService.meAddPostImage({ file, userId });
    const url = imageData.url;
    const placeholder = imageData.placeholder;
    return res.set({ 'Content-Type': 'image/png', 'x-backend-id': imageData.backendID }).json({ url, placeholder });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete post image',
  })
  @ApiResponse({
    status: 200,
    description: 'Post image deleted successfully',
    // type: () => ({ postID: String, url: String})
  })
  @ApiResponse({
    status: 404,
    description: 'Error deleting post image',
    type: ErrorResponseDTO,
  })
  @Delete('/post-image/:id')
  async meDeletePostImage(@CurrentUser('id') userId: string, @Param('id') backendId: string, @Res() res: Response) {
    const deleted = await this.meService.meDeletePostImage({ backendId, userId });
    return res.json(deleted);
  }
}

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { ImageFileMimeType } from '@/me/types/imageFileMimeType.type';
import { FingerprintObj } from '@/auth/types/fingerprint.type';
import { getFileMimeType } from '@/utils/getFileMimeType';
import { UsersService } from '@/users/users.service';
import { argonConfig } from '@/config/argon.config';
import { AuthService } from '@/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { access, unlink } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { extname, join } from 'path';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class MeService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async activateMe(token: string, fingerprint: FingerprintObj): Promise<{ message: string; cookieToken: string }> {
    try {
      const decodeToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('TEMP_JWT_SECRET'),
      });

      if (!decodeToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      const updatedUser = await this.userService.activate(decodeToken.id, {
        isActivated: true,
      });
      if (!updatedUser) {
        throw new InternalServerErrorException('Failed to activate account');
      }
      const message = 'Account activated successfully';
      const cookieToken = await this.authService.generateAndSaveToken(updatedUser, fingerprint);
      return { message, cookieToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userService.getUserById(id, '+password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isValidPassword = await argon2.verify(user.password, oldPassword, argonConfig);
    if (!isValidPassword) {
      // Invalid credentials
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.userService.update(id, {
      password: newPassword,
    });
    return { message: 'Password updated successfully' };
  }
  async getProfileImage(id: string): Promise<string> {
    try {
      const imageName = `${id}.profile.png`;
      const folder = join(__dirname, '..', '..', 'public', 'profile-images');
      const imagePath = join(folder, imageName);
      await access(imagePath);
      const publicProfileImage = `/public/profile-images/${imageName}`;
      return publicProfileImage;
    } catch {
      const folder = join(__dirname, '..', '..', 'public', 'defaults');
      const defaultImagePath = join(folder, 'profile-image.png');

      try {
        await access(defaultImagePath);

        // Return default public profile image path;
        return '/public/defaults/profile-image.png';
      } catch (error) {
        new Logger('ProfileImage').log(error);
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
  async uploadProfileImage(file: Express.Multer.File, id: string): Promise<any> {
    try {
      // Validating extension

      const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

      const isValidExt = allowedImageExtensions.includes(extname(file.originalname).toLowerCase());
      if (!isValidExt) {
        throw new UnprocessableEntityException(
          `Validation failed (Expected image extensions: ${allowedImageExtensions.join('|')})`,
        );
      }

      // Validating mime-type
      const allowedImageMimeTypes: ImageFileMimeType[] = ['image/jpeg', 'image/png', 'image/webp'];
      const mimeType = await getFileMimeType(file);
      const isValidMimeType = allowedImageMimeTypes.includes(mimeType as ImageFileMimeType);
      if (!isValidMimeType) {
        throw new UnprocessableEntityException('Validation failed (Invalid file mime-type)');
      }
      // Validating size
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size >= maxSize) {
        throw new UnprocessableEntityException('Validation failed (File size exceeds the limit)');
      }
      const filename = `${id}.profile.png`;
      const folder = join(__dirname, '..', '..', 'public', 'profile-images');
      return saveToDisk({ buffer: file.buffer, filename, folder });
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  async deleteProfileImage(id: string) {
    const filename = `${id}.profile.png`;

    const folder = join(__dirname, '..', '..', 'public', 'profile-images');
    return deleteFromDisk({ filename, folder });
  }
  async meAddPostImage({
    file,
    userId,
  }: {
    file: Express.Multer.File;
    userId: string;
  }): Promise<{ url: string; placeholder: string; backendID: string }> {
    try {
      // Validating extension
      const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const isValidExt = allowedImageExtensions.includes(extname(file.originalname).toLowerCase());
      if (!isValidExt) {
        throw new UnprocessableEntityException(
          `Validation failed (Expected image extensions: ${allowedImageExtensions.join('|')})`,
        );
      }

      // Validating mime-type
      const allowedImageMimeTypes: ImageFileMimeType[] = ['image/jpeg', 'image/png', 'image/webp'];
      const mimeType = await getFileMimeType(file);
      const isValidMimeType = allowedImageMimeTypes.includes(mimeType as ImageFileMimeType);
      if (!isValidMimeType) {
        throw new UnprocessableEntityException('Validation failed (Invalid file mime-type)');
      }
      // Validating size
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size >= maxSize) {
        throw new UnprocessableEntityException('Validation failed (File size exceeds the limit)');
      }

      // generete unique id
      const uniqueId = crypto.randomBytes(16).toString('hex');

      // Converting to png
      const imageName = `${userId}.${uniqueId}.post.png`;
      const publicFolder = join(__dirname, '..', '..', 'public');

      const imagesFolderPath = join(publicFolder, 'posts');

      await saveToDisk({ buffer: file.buffer, filename: imageName, folder: imagesFolderPath });
      // testing
      const imagePath = join(imagesFolderPath, imageName);

      await access(imagePath);

      // Return public url of the post image
      const url = `/public/posts/${imageName}`;

      // Generate placeholder image if no image uploaded
      const placeholderBuffer = await sharp(imagePath).blur(100).png({ quality: 10 }).toBuffer();
      const placeHolderName = `${userId}.${uniqueId}.placeholder.png`;
      await saveToDisk({ buffer: placeholderBuffer, filename: placeHolderName, folder: imagesFolderPath });

      const placeholderPath = join(imagesFolderPath, placeHolderName);
      await access(placeholderPath);

      // Return public url of the placeholder image
      const placeholder = `/public/posts/${placeHolderName}`;
      return { url, placeholder, backendID: uniqueId };
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async meDeletePostImage({ backendId, userId }: { backendId: string; userId: string }): Promise<any> {
    try {
      const imageName = `${userId}.${backendId}.post.png`;
      const publicFolder = join(__dirname, '..', '..', 'public');
      const imagesFolderPath = join(publicFolder, 'posts');
      const imagePath = join(imagesFolderPath, imageName);
      await access(imagePath);
      deleteFromDisk({ filename: imageName, folder: imagesFolderPath });

      // Deleting placeholder
      const placeholderName = `${userId}.${backendId}.placeholder.png`;
      // Same folder as images
      const placeholderPath = join(imagesFolderPath, placeholderName);
      await access(placeholderPath);
      // Same folder as images
      deleteFromDisk({ filename: placeholderName, folder: imagesFolderPath });
    } catch {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

async function saveToDisk({ buffer, filename, folder }: { buffer: Buffer; filename: string; folder: string }) {
  const filePath = join(folder, filename);
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }
  const pngBuffer = await sharp(buffer).toFormat('png').toFile(filePath);

  return pngBuffer;
}
async function deleteFromDisk({ filename, folder }: { filename: string; folder: string }): Promise<string> {
  const filePath = join(folder, filename);
  try {
    await unlink(filePath);
    return 'Image deleted successfully';
  } catch (error) {
    throw new InternalServerErrorException('Error deleting image');
  }
}

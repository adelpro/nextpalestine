import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { POST, POSTDocument } from './schemas/post.schema';
import { NewPOSTObjectDTO } from './dtos/newPOST.dto';
import { InjectModel } from '@nestjs/mongoose';
import { unlink } from 'fs/promises';
import { Model } from 'mongoose';
import { join } from 'path';

@Injectable()
export class PostsService {
  constructor(@InjectModel(POST.name) private postModel: Model<POSTDocument>) {}

  async getAll(): Promise<POST[]> {
    return await this.postModel.find().exec();
  }
  async getPostById(id: string): Promise<POST> {
    const post = await this.postModel.findById({ _id: id }).exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  /**
   * Retrieves the posts by user ID.
   *
   * @param {string} userId - The ID of the user.
   * @return {Promise<POST[]>} - A promise that resolves to an array of posts.
   */
  async getMePosts(userId: string): Promise<POST[]> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const posts = await this.postModel.find({ user: userId }).lean().exec();
    if (!posts) {
      throw new NotFoundException('Posts not found');
    }
    return posts;
  }

  /**
   * Retrieves a specific post for a given user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} id - The ID of the post.
   * @return {Promise<POST>} The requested post.
   */
  async getMePost(userId: string, id: string): Promise<POST> {
    // Using both userId and id (of the post) to ensure that the user has access to the post

    // You can use populate to add more user info
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    if (!id) {
      throw new NotFoundException('Post not found');
    }
    const post = await this.postModel.findOne({ _id: id, user: userId }).lean().exec();

    if (!post) {
      throw new NotFoundException('Posts not found');
    }
    return post;
  }

  /**
   * Updates a post by ID and user ID.
   * @param {string} userId - The ID of the user who owns the post.
   * @param {string} id - The ID of the post to update.
   * @param {Partial<POST>} post - The partial post object with the updated data.
   * @return {Promise<POST>} The updated post.
   */
  async meUpdatePost(userId: string, id: string, post: Partial<POST>): Promise<POST> {
    // Using both userId and id (of the post) to ensure that the user has access to the post
    const updatedPost = await this.postModel
      .findOneAndUpdate({ user: userId, _id: id }, post, { new: true })
      .lean()
      .exec();
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }
  /**
   * Deletes a post with the specified ID belonging to a user.
   *
   * @param {string} userId - The ID of the user that owns the post.
   * @param {string} id - The ID of the post to delete.
   * @return {Promise<POST>} The deleted post.
   */
  async meDeletePost(userId: string, id: string): Promise<POST> {
    const deletedPost = await this.postModel.findOneAndDelete({ user: userId, _id: id }).lean().exec();
    if (!deletedPost) {
      throw new NotFoundException('Post not found');
    }
    // Deleting images
    if (deletedPost.content) {
      const backendIds = getAllImagesIds(deletedPost.content);
      const publicFolder = '../uploads/public/';

      for (const id of backendIds) {
        try {
          const imageName = `${userId}.${id}.post.png`;
          await deleteImageFromDisk({ filename: imageName, folder: publicFolder });
          const placeholderName = `${userId}.${id}.placeholder.png`;
          await deleteImageFromDisk({ filename: placeholderName, folder: publicFolder });
        } catch {
          throw new InternalServerErrorException('Internal Server Error');
        }
      }
    }
    return deletedPost;
  }

  /**
   * Add a new post for a user.
   *
   * @param {string} userId - The ID of the user who is creating the post.
   * @param {NewPostObjectDTO} newPost - The object containing the details of the new post.
   * @return {Promise<POST>} A promise that resolves to the created post.
   */
  async meAddNewPost(userId: string, newPost: NewPOSTObjectDTO): Promise<POST> {
    const post = newPost.post;

    const createdPost = new this.postModel({ ...post, user: userId });
    if (!(await createdPost.save())) {
      throw new InternalServerErrorException('New post not created');
    }

    return createdPost;
  }
}
async function deleteImageFromDisk({ filename, folder }: { filename: string; folder: string }): Promise<void> {
  const filePath = join(__dirname, folder, filename);
  try {
    await unlink(filePath);
    console.log('Image deleted successfully:', filePath);
  } catch {
    console.error('Error deleting image', filePath);
    //throw new InternalServerErrorException('Error deleting image');
  }
}
const getAllImagesIds = (content: string): string[] => {
  if (!content) return [];
  const data = JSON.parse(content);
  if (!data?.root?.children) {
    return [];
  }
  const backendIds: string[] = [];
  for (const child of data.root.children) {
    if (child?.type === 'paragraph' && child?.children[0]?.type === 'image' && child?.children[0]?.backendId) {
      backendIds.push(child?.children[0]?.backendId);
    }
  }
  return backendIds;
};

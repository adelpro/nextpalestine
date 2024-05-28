import { Body, Controller, Delete, Get, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from './schemas/user.schema';
import { ObjectId } from 'mongoose';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAll(@Res() response: Response) {
    const users = await this.userService.getAll();
    return response.status(HttpStatus.OK).json({
      users,
    });
  }

  @Get('/:id')
  async getUserById(@Res() response: Response, @Param('id') id: ObjectId) {
    const user = await this.userService.getUserById(id.toString());
    return response.status(HttpStatus.OK).json({
      user,
    });
  }

  @Put('/:id')
  async update(@Res() response: Response, @Param('id') id: ObjectId, @Body() user: User) {
    const updatedUser = await this.userService.update(id.toString(), user);
    return response.status(HttpStatus.OK).json({
      updatedUser,
    });
  }

  @Delete('/:id')
  async delete(@Res() response: Response, @Param('id') id: ObjectId) {
    const deletedUser = await this.userService.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedUser,
    });
  }
}

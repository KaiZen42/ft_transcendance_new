import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserImg, UpdateUserName } from './dto/update-user.dto';
import { LoginUsreDto } from './dto/login-user.dto';
import { User } from './models/user.entity';
//import Multer, { diskStorage, MulterError } from 'multer';
import { AnyFilesInterceptor, FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { IsNotEmptyObject } from 'class-validator';

@Controller('users')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get()
  async users(): Promise<User[]> {
    return await this.user.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    return await this.user.getById(id);
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string): Promise<User> {
    return await this.user.getByEmail(email);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor("to_upload", {
	fileFilter: (request, newImage, callback) => {
		if (!newImage.mimetype.includes('image')) {
		  return callback(new Error('Provide a valid image'), false);
		}
		callback(null, true);
	},
	limits: {
		fileSize: Math.pow(1024, 2)
	},
	storage: diskStorage({destination: './imgs'})
  }))
  async uploadImage(@Req() user, @UploadedFile() newImage: Express.Multer.File) {
	return newImage.originalname;
  }


  @Put('image/:id')
  async updateImg(@Param('id') id: number, @Body() userData: UpdateUserImg) {
    await this.user.update(id, userData);
    return this.user.getById(id);
  }

  @Put('username/:id')
  async updateUsername(@Param('id') id: number, @Body() userData: UpdateUserName) {
    await this.user.update(id, userData);
    return this.user.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.user.delete(id);
  }


}

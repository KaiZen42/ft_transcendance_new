import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUser, UpdateUserImg, UpdateUserName } from './dto/update-user.dto';
import { LoginUsreDto } from './dto/login-user.dto';
import { User } from './models/user.entity';
//import Multer, { diskStorage, MulterError } from 'multer';
import { AnyFilesInterceptor, FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { IsNotEmptyObject } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

@Controller('users')
export class UserController {
	constructor(private readonly user: UserService,
		private readonly jwt: JwtService,) { }

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
		storage: diskStorage({
			destination: './imgs',
			filename: (req, file, cb) => {
				return cb(null, Date.now() + '-' + file.originalname)
		  
			}
		})
	}))
	async uploadImage(@Req() request: Request, @UploadedFile() newImage: Express.Multer.File) {
		const cookie = request.cookies['token'];
		const data = await this.jwt.verifyAsync(cookie);
      	this.user.addImage(data['id'], `http://${process.env.BASE_IP}:3000/api/users/${newImage.path}` );
		return {url: `http://${process.env.BASE_IP}:3000/api/${newImage.path}`}
  }

	@Get('imgs/:path')
	async getImage(
		@Param('path') path,
		@Res() response: Response
		){response.sendFile(path, {root: 'imgs'})}

	@Put('update/:id') //TOFIX userdata da any a dto
	async updateUser(@Param('id') id: number, @Body() userData: any) {
		console.log(userData)
		await this.user.update(id, userData);
		return this.user.getById(id);
	}


	@Get('username/:username')
	async getByUsername(@Param('username') username: string): Promise<User[]> {
	  return await this.user.getByUsername(username);
	}

//   @Put('image/:id')
//   async updateImg(@Param('id') id: number, @Body() userData: UpdateUserImg) {
//     await this.user.update(id, userData);
//     return this.user.getById(id);
//   }

//   @Put('username/:id')
//   async updateUsername(@Param('id') id: number, @Body() userData: UpdateUserName) {
//     await this.user.update(id, userData);
//     return this.user.getById(id);
//   }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.user.delete(id);
  }
}

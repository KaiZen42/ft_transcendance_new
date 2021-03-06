import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUser } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  @Get()
  async users(): Promise<User[]> {
    return await this.user.getAll();
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string): Promise<User> {
    return await this.user.getByEmail(email);
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('to_upload', {
      fileFilter: (request, newImage, callback) => {
        if (!newImage.mimetype.includes('image')) {
          return callback(new Error('Provide a valid image'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2),
      },
      storage: diskStorage({
        destination: './imgs',
        filename: (req, file, cb) => {
          return cb(null, Date.now() + '-' + file.originalname);
        },
      }),
    }),
  )
  async uploadImage(
    @Req() request: Request,
    @UploadedFile() newImage: Express.Multer.File,
  ) {
    const cookie = request.cookies['token'];
    const data = await this.jwt.verifyAsync(cookie);
    const fs = require('fs');
    const prevPath = (await this.user.getById(data['id'])).avatar;
    if (prevPath.indexOf('/api/users/imgs') > -1) {
      fs.unlinkSync('.' + prevPath.substring(10));
    }
    this.user.addImage(data['id'], `/api/users/${newImage.path}`);
    return {
      url: `/api/users/${newImage.path}`,
    };
  }

  @Get('imgs/:path')
  async getImage(@Param('path') path, @Res() response: Response) {
    response.sendFile(path, { root: 'imgs' });
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: number, @Body() userData: UpdateUser) {
    await this.user.update(id, userData);
    return this.user.getById(id);
  }

  @Put('updatePoints/:id')
  async updatePoints(
    @Param('id') id: number,
    @Body() userData: { points: number; wins: number; losses: number },
  ) {
    await this.user.updatePoints(id, userData);
    return this.user.getById(id);
  }

  @Get('username/:username')
  async getByUsername(
    @Param('username') username: string,
  ): Promise<User | { id: number }> {
    const res = await this.user.getByUsername(username);
    if (!res) return { id: 0 };
    return res;
  }

  @Get('likeusername/:username')
  async getLikeUsername(@Param('username') username: string): Promise<User[]> {
    return await this.user.getLikeUsername(username);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.user.delete(id);
  }

  @Get('leader')
  async getByLeader(): Promise<User[]> {
    return await this.user.getLeader();
  }
}

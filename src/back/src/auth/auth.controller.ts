import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginUsreDto } from 'src/user/dto/login-user.dto';
import { Request, Response } from 'express';
import { User } from '../user/models/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return await this.user.create(userData);
  }

  @Post('login')
  async login(
    @Body() userData: LoginUsreDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    return await this.user.login(userData, response);
  }

  @Get('user')
  async userCookie(@Req() request: Request) {
    const cookie = request.cookies['token'];
    return await this.user.userCookie(cookie);
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return {
      message: 'Success',
    };
  }
}

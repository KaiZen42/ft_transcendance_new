import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Param, 
  Req,
  Res, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginUsreDto } from 'src/user/dto/login-user.dto';
import { Request, Response } from 'express';
import { User } from '../user/models/user.entity';
import {AuthGuard} from "./auth.guard";

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

  @UseGuards(AuthGuard)
  @Get('user')
  getUserInfo(@Param('code') code: string) {
    console.log(code);
    /*return test;*/
  }
  /*async userCookie(@Req() request: Request) {
    const cookie = request.cookies['token'];
    return await this.user.userCookie(cookie);
  }*/

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return {
      message: 'Success',
    };
  }
}

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
  Query,
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
  async create(@Body() userData: any): Promise<any> {
    if (!await this.user.getById(userData.id))
    {
      return await this.user.create(userData);
    }
    else return this.user.getById(userData.id)
  }

  @Get('login')
  async login(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return await this.user.login(code, response);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async userCookie(@Req() request: Request) {
    const cookie = request.cookies['token'];
    return await this.user.userCookie(cookie);
  }

  @UseGuards(AuthGuard)
  @Get('checkAuth')
  ck(): boolean
  {
    return true;
  }


  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return {
      message: 'Success',
    };
  }
}

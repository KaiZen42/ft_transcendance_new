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
  ValidationPipe,
  Redirect,
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

  // @Post('register')
  // async create(@Body() userData: CreateUserDto): Promise<User> {
  //   if (!await this.user.getById(userData.id))
  //   {
  //     return await this.user.create(userData);
  //   }
  //   else return this.user.getById(userData.id)
  // }

  @Get('login')
  async login(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    await this.user.login(code, response);
    return response.redirect("http://localhost:8080/");
  }

  //@UseGuards(AuthGuard)
  @Get('user')
  async userCookie(@Req() request: Request) {
    const cookie = request.cookies['token'];
    console.log("cookie is: " + cookie);
    if (typeof cookie === 'undefined')
      return {id: null};
      //return "ritorno cookie errore";
    const user = await this.user.userCookie(cookie);
    console.log("user="+user.username);
    return (user);
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

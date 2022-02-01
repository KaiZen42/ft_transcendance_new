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
  import { JwtService } from '@nestjs/jwt';
  import fetch from 'node-fetch';

@Controller()
export class AppController {

@Get("/package")
getHello() : string {
		return ( 'ciao' );
	}
}
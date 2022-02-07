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
  import { LoginUsreDto } from 'src/user/dto/login-user.dto';
  import { Request, Response } from 'express';
  import { User } from '../user/models/user.entity';
  import { JwtService } from '@nestjs/jwt';
  import fetch from 'node-fetch';
import { Message } from './models/message.entity';
import { MessageService } from './message.service';
import { authenticator } from '@otplib/preset-default';

@Controller("chat")
export class chatController {
	constructor(private readonly msgService: MessageService) { }


	@Get("message")
	hello(): string
	{return "hello message";}

	@Get("USmessage/:userId")
	async getMsgByUser(@Param('userId') userId: number): Promise<Message[]>
	{
		return await this.msgService.getByUser(userId);
	}

	@Get("CHmessage/:channelId")
	async getMsgByChannel(@Param("channelId") channelId: number)
	{
		return await this.msgService.getByChannel(channelId);
	}
}
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
import { Message } from './models/message.entity';
import { MessageService } from './service/message.service';

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
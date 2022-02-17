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
import { ChannelInfo, messageDto } from './dto/chat.dto';
import { Channel } from './models/channel.entity';
import { Message } from './models/message.entity';
import { ChannelService } from './service/channel.service';
import { MessageService } from './service/message.service';

@Controller("chat")
export class chatController {
	constructor(private readonly msgService: MessageService,
				private readonly chService: ChannelService) { }


	@Get("message")
	hello(): string
	{return "hello message";}

	@Get("USmessage/:userId")
	async getMsgByUser(@Param('userId') userId: number): Promise<Message[]>
	{
		return await this.msgService.getByUser(userId);
	}

	@Get("CHmessage/:channelId")
	async getMsgByChannel(@Param("channelId") channelId: number) : Promise<any[]>
	{
		let ms : any[] =  await this.msgService.getByChannel(channelId);
		console.log(`MESSAGE (${channelId}): `,ms);
		return ms;
	}

	@Get("UserInChannel/:channelId")
	async getUsersByChannel(@Param("channelId") channelId: number) : Promise<any[]>
	{
		let ms : any[] =  await this.chService.getUserByChan(channelId);
		console.log(`Users in(${channelId}): `, ms);
		return ms;
	}

	@Get("OtherUserInChannel/:channelId/User/:userId")
	async getOtherUsersByChannel(@Param("channelId") channelId: number, @Param("userId") userId: number) : Promise<any[]>
	{
		let ms : any[] =  await this.chService.getOtherByChan(channelId, userId);
		console.log(`Users in(${channelId}): `, ms);
		return ms;
	}


	@Get("channels/:idUser")
	async getChannels(@Param("idUser") userID: number) : Promise<ChannelInfo[]>
	{
		let someThings: ChannelInfo[] =  await this.chService.getChanByUser(userID)
		console.log("QUALCOSA: ", someThings);
		return someThings;
	}
}
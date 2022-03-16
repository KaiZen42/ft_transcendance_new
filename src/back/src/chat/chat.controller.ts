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
	Put,
	Delete,
  } from '@nestjs/common';
import { ChannelInfoDto, messageDto } from './dto/chat.dto';
import { Channel } from './models/channel.entity';
import { Message } from './models/message.entity';
import { Partecipant } from './models/partecipant.entity';
import { ChannelService } from './service/channel.service';
import { MessageService } from './service/message.service';
import { PartecipantService } from './service/partecipant.service';

@Controller("chat")
export class chatController {
	constructor(private readonly msgService: MessageService,
				private readonly partService: PartecipantService,
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
		let ms : any =  await this.chService.getOtherByChan(channelId, userId);
		console.log(`Users in(${channelId}): `, ms);
		return ms;
	}



	@Get("ChannelByName/:name")
	async getTest(@Param("name") name: string) : Promise<any[]>
	{
		let ms : any[] =  await this.chService.getByName(name);
		console.log(`NAME is(): `, ms);
		return ms;
	}

	@Get("TEST/:id1")
	async test(@Param("id1") chanId: number) : Promise<any>
	{
		let someThings: any =  await this.partService.getCompletePartecipantByChannel(chanId)
		console.log("QUALCOSA: ", someThings);
		return someThings;
	}

	@Get("getFullPartInfoNyChan/:id1")
	async getFullPartInfoNyChan(@Param("id1") chanId: number) : Promise<any>
	{
		let someThings: any =  await this.partService.getCompletePartecipantByChannel(chanId)
		//console.log("QUALCOSA: ", someThings);
		return someThings;
	}

	@Get("userOnline")
	async getUsersIdByChan() : Promise<number[]>
	{
		let ids: number[] =  await this.partService.getUsersIdByChan(1)
		return ids;
	}

	@Get("ChannelsInfo/:idUser")
	async getChannelsInfo(@Param("idUser") userID: number) : Promise<ChannelInfoDto[]>
	{
		let someThings: ChannelInfoDto[] =  await this.chService.getInfoChanByUser(userID)
		console.log("QUALCOSA: ", someThings);
		return someThings;
	}

	@Get("ChannelsInfoId/:idChan")
	async getChannelsInfoById(@Param("idChan") chanId: number) : Promise<ChannelInfoDto>
	{
		let someThings: ChannelInfoDto =  await this.chService.getInfoChanById(chanId)
		console.log("QUALCOSA: ", someThings);
		return someThings;
	}

	@Get("GetMessageCounter/:idChan")
	async GetMessageCounter(@Param("idChan") chanId: number) : Promise<number>
	{
		let someThings: number =  await this.msgService.getCounterByChannel(chanId)
		return someThings;
	}

	@Get("GetPartecipantByUserAndChan/:idChan/:idUser")
	async GetPartecipantByUserAndChan(@Param("idChan") chanId: number, @Param("idUser") userId:number)
	{
		let someThings: Partecipant = await this.partService.getPartecipantByUserAndChan(userId, chanId);
		return someThings;
	}

	@Put("UpdateGroup")
	async UpdateGroup(@Body() toUpdate: { name: string; mode: string; pass: string; id: number })
	{
		await this.chService.updateChannel(toUpdate);
	}

	@Delete("RemoveGroup/:chanId")
	async DeleteGroup(@Param("chanId") chanId: number)
	{
		await this.chService.delete(chanId)
	}

	@Delete("RemoveAllPartecipants/:chanId")
	async RemoveAllPartecipants(@Param("chanId") chanId: number)
	{
		await this.partService.deleteAllByChan(chanId);
	}



}
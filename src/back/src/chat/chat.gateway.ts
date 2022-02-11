import { Logger } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WsResponse,
  } from '@nestjs/websockets';
import { time } from 'console';
import { Socket, Server } from 'socket.io';
import { creationDto } from './dto/creation.dto';
import { inviteDto } from './dto/invite.dto';
import { messageDto } from './dto/message.dto';
import { Channel } from './models/channel.entity';

import { Message } from './models/message.entity';
import { ChannelService } from './service/channel.service';
import { MessageService } from './service/message.service';
import { PartecipantService } from './service/partecipant.service';

  
@WebSocketGateway({ cors : true , namespace : "chat"})
export class ChatGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor(
		private readonly messageService: MessageService,
		private readonly channelService: ChannelService,
		private readonly partService: PartecipantService)
	{}

	@WebSocketServer()
	server: Server;
	
	date: Date = new Date();

	private logger: Logger = new Logger('TestGateway');
	
	afterInit(server: Server)
	{
		this.logger.log("WS SERVER ON");
	}

	handleConnection(client: Socket)
	{
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket , ...args: any[])
	{
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('channelMessage')
	recieveChannelMessage(client: Socket, mex: messageDto) : WsResponse<messageDto>{
		console.log(mex);
		const msg : Message = new Message()
		//this.logger.log(`MSG ID ${msg.id}`);
		msg.userId = mex.idUser;
		msg.data = mex.data;
		msg.sendDate = this.date;
		msg.channelId = +mex.room;
		this.messageService.create(msg);
		this.server.to(mex.room).emit("message", mex);
		
		this.logger.log(`Data recived is: ${mex.data} From: ${mex.idUser} to ${mex.room === undefined ? "UNA": mex.room}: ${mex.user}`)
		return({event: "channelMessage", data: mex})
	}



	@SubscribeMessage('createRoom')
	async createRoom(socket: Socket, data: creationDto) : Promise< WsResponse<inviteDto> >
	{
		const chan: Channel = new Channel();
		chan.isPrivate = (data.otherUser !== undefined);
		chan.name = chan.isPrivate ? `${data.idUser}`+ `${data.otherUser}` : data?.name;
		chan.pass = data?.pass;
		chan.mode = chan.isPrivate ? "PRI" : "PUB";
		chan.id = (await this.channelService.create(chan, [data.idUser, data.otherUser])).id;

		socket.join("" + chan.id);
		this.server.emit('createdRoom', {idUser : data.otherUser, room: "" + chan.id});
		this.logger.log(`Channel created (${chan.isPrivate}): ID: ${chan.id} name ${chan.name} whith ${data.idUser} | ${data.otherUser}`);
		return { event: 'createRoom', data : {idUser : data.otherUser, room: "" + chan.id}};
	}

	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, data: inviteDto) : WsResponse<boolean>
	{
		
		client.join(data.room);

		const msg : Message = new Message()
		//this.logger.log(`MSG ID ${msg.id}`);
		msg.userId = data.idUser
		msg.data = "JOINED ROOM"
		msg.sendDate = this.date
		this.messageService.create(msg);
		this.logger.log(`JOIN ${data.idUser} in ${data.room}`);
		return { event: 'joinRoom', data : true};
	}
	  

}

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
import { Socket, Server } from 'socket.io';
import { creationDto } from './dto/creation.dto';
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
		this.server.to(mex.room).emit("message", mex.room)

		const msg : Message = new Message()
		//this.logger.log(`MSG ID ${msg.id}`);
		msg.userId = mex.idUser
		//msg.channelId = 69;
		msg.data = mex.data
		msg.sendDate = this.date
 
		this.logger.log(`Data recived is: ${mex.data} From: ${mex.idUser}: ${mex.user}`)
		return({event: "message", data: mex})
	}

	@SubscribeMessage('privateMessage')
	recieveChatMessage(client: Socket, mex: messageDto) : WsResponse<messageDto>{
		console.log(mex);
		this.server.to(mex.room).emit("message", mex.room)

		const msg : Message = new Message()
		//this.logger.log(`MSG ID ${msg.id}`);
		msg.userId = mex.idUser
		//msg.channelId = 69;
		msg.data = mex.data
		msg.sendDate = this.date
 
		this.logger.log(`Data recived is: ${mex.data} From: ${mex.idUser}: ${mex.user}`)
		return({event: "message", data: mex})
	}

	@SubscribeMessage('createRoom')
	createRoom(socket: Socket, data: creationDto) : WsResponse<String>
	{
		const chan: Channel = new Channel();
		chan.isPrivate = (data.otherUser !== undefined);
		chan.name = chan.isPrivate ? data.idUser.toString() + data.otherUser.toString() : data?.name;
		chan.pass = data?.pass;
		chan.mode = chan.isPrivate ? "PRI" : "PUB";
		this.channelService.create(chan);

		socket.join(chan.name);
		socket.to(chan.name).emit('createRoom', {room: chan.name});

		this.logger.log(`Channel created (${chan.isPrivate}): name ${chan.name} whith ${data.idUser} | ${data.otherUser}`);
		return { event: 'createRoom', data : chan.name};
	  }
	
}

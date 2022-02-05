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
import { messageDto } from './dto/message.dto';
import { MessageService } from './message.service';
import { Message } from './models/message.entity';

  
@WebSocketGateway({ cors : true , namespace : "chat"})
export class ChatGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	constructor(private readonly messageService: MessageService)
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

	@SubscribeMessage('message')
	recieveChatMessage(client: Socket, mex: messageDto) : WsResponse<messageDto> {
		console.log(mex);
		this.server.emit('message', mex);

		const msg : Message = new Message();
		msg.userId = mex.idUser;
		//msg.channelId = 69;
		msg.data = mex.data;
		msg.sendDate = this.date;
		this.messageService.create(msg);

		this.logger.log(`Data recived is: ${mex.data} From: ${mex.idUser}: ${mex.user}`);
		return({event: "message", data: mex} );
	}

}

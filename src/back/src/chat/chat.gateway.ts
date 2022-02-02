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
	import { Message } from './models/message.entity';
  
@WebSocketGateway({ cors : true , namespace : "chat"})
export class ChatGatewa 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

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
		this.logger.log(`Data recived is: ${mex.data} From: ${mex.idUser}: ${mex.user}`);
		return({event: "message", data: mex} );
	}

}

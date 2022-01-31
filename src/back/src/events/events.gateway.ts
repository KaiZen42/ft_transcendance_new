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
export class EventsGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('TestGateway');
	
	afterInit(server: Server)
	{
		console.log("INIZIALIZZATOOOOOOOO");
		this.logger.log('Init');
	}

	handleConnection(client: Socket)
	{
		console.log(`SI É CONNESSOOOOOOOOOOOO ${client.id}`);
		this.logger.log(`Chat::Client connected: ${client.id}`);
		this.server.emit(`DAJE FRA ${client.id}`);
	}

	handleDisconnect(client: Socket , ...args: any[])
	{
		console.log("ADDIOOOOOOOOOOOOOO");
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('message')
	recieveChatMessage(client: Socket, mex: Message) : WsResponse<Message> {
		this.logger.log(`Data recived is: ${mex.data} From: ${mex.userId}`);
		return({event: "message", data: mex} );
	}

}

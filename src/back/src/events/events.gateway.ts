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
	recieveChatMessage(client: Socket, data: string) : WsResponse<string> {
		this.server.emit(`DAJE FRA ${data}`);
		return({event: "message", data: data});
	}

}

/* import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService, IncomingChatMessage } from './chat.service';
import { Logger } from '@nestjs/common';
import { ChatMessage } from './chat.entity';

@WebSocketGateway({ cors: true })
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;
	constructor(private readonly chatService: ChatService) {}

	private logger: Logger = new Logger('ChatGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Chat::Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Chat::Client connected: ${client.id}`);
	}

	@SubscribeMessage('sendChatMessage')
	async recieveChatMessage(client: Socket, payload: IncomingChatMessage) {
		let msg: ChatMessage = await this.chatService.addMessage(payload);
		this.server.emit(
			'msgToClients',
			[{sender: msg.sender, message: msg.message}]
		);
	}
} */
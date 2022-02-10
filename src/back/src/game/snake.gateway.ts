
const FRAME_RATE = 10

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./snake.service";

@WebSocketGateway({ cors : true , namespace : "snake"})
export default class SnakeGateway implements
	OnGatewayConnection, OnGatewayDisconnect {
		constructor(private readonly game: GameService){}
	
	private state: any
	
	@WebSocketServer()
	private readonly server: Server;

	handleDisconnect(client: any) {
		console.log("disconnect");
	}
	
	startGameInterval(client: Socket, state: any) {
		const intervalId = setInterval(() => {
			const winner = this.game.gameLoop(state)
			if (!winner)
				client.emit('gameState', JSON.stringify(state))
			else
			{
				client.emit('gameOver')
				clearInterval(intervalId)
			}
		}, 1000 / FRAME_RATE)		
	}
	
	handleConnection(client: Socket) {
		this.state = this.game.createGameState()

		this.startGameInterval(client, this.state)
	}

	@SubscribeMessage('keyDown')
	handleKeyDown(
		@MessageBody() key: string,
		@ConnectedSocket() client: Socket
	){
		const vel = this.game.getUpdatedVelocity(key);

		if (vel)
			this.state.player.vel = vel
	}
}
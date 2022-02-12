
const FRAME_RATE = 10

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket} from "socket.io";
import { GameService } from "./snake.service";

interface GameInfo {
	state: any,
	playerCount: number
}

@WebSocketGateway({ cors : true , namespace : "snake"})
export default class SnakeGateway implements
	OnGatewayDisconnect, OnGatewayConnection {
		constructor(private readonly game: GameService){}
	
	private loopLimit = 0
	private clientRooms: Object = {} // works like a map, key=clientId, value=roomId
	private rooms: Map<string, GameInfo> = new Map<string, GameInfo>()
	
	@WebSocketServer()
	private server: Server;

	handleDisconnect(client: any) {
		console.log("disconnect");
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log("a player (" + client.id +") connected, list of rooms: ")
	}

	@SubscribeMessage('joinGame')
	handleJoinGame(
		@ConnectedSocket() client: Socket
	){
		this.loopLimit = 0
		this.joinGame(client)
	}

	@SubscribeMessage('keyDown')
	handleKeyDown(
		@MessageBody() key: string,
		@ConnectedSocket() client: Socket
	){
		const roomId = this.clientRooms[client.id]
		if (!roomId)
			return
		const vel = this.game.getUpdatedVelocity(key);

		if (vel)
			this.rooms.get(roomId).state.players[client.data.number - 1].vel = vel
	}
	
	startGameInterval(roomId: string) {
		const intervalId = setInterval(() => {
			console.log(this.rooms.get(roomId).state)
			const winner = this.game.gameLoop(this.rooms.get(roomId).state)
			if (!winner)
				this.emitGameState(roomId, this.rooms.get(roomId).state)
			else
			{
				this.emitGameOver(roomId, winner)
				this.rooms.delete(roomId)
				clearInterval(intervalId)
			}
		}, 1000 / FRAME_RATE)		
	}

	emitGameState(roomId: string, state: any)
	{
		this.server.to(roomId).emit("gameState", JSON.stringify(state))
	}

	emitGameOver(roomId: string, winner: number)
	{
		this.server.to(roomId).emit("gameOver", winner)
	}
	
	createGame(client: Socket)
	{
		console.log("createGame")
		// i have to understand if i can use socket default room
		const roomId : string = this.makeId(5)
		this.clientRooms[client.id] = roomId
		this.rooms.set(roomId, {state: this.game.initgame(), playerCount: 1})

		client.join(roomId)
		client.data.number = 1
		client.emit('init', 1)
	}

	joinGame(client: Socket)
	{
		console.log("joinGame")
		this.loopLimit++
		if (this.rooms.size === 0 || this.loopLimit >= 20)
			return this.createGame(client)
		const randPick = Math.floor(Math.random() * this.rooms.size);
		const roomId = Array.from(this.rooms.keys())[randPick]
		const room: GameInfo = this.rooms.get(roomId)
		if (room.playerCount === 1)
		{
			this.clientRooms[client.id] = roomId
			client.join(roomId)
			client.data.number = 2
			client.emit('init', 2)

			this.startGameInterval(roomId)
		}
		else
			this.joinGame(client)
	}

	makeId(length) {
		let result           = '';
		const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}

const FRAME_RATE = 10

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "./snake.service";

@WebSocketGateway({ cors : true , namespace : "snake"})
export default class SnakeGateway implements
	OnGatewayDisconnect, OnGatewayConnection {
		constructor(private readonly game: GameService){}
	
	private loopLimit = 0
	private state: Object = {} // works like a map, key=roomId, value=state of room
	private clientRooms: Object = {} // works like a map, key=clientId, value=roomId
	
	@WebSocketServer()
	private server: Server;

	handleDisconnect(client: any) {
		console.log("disconnect");
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log("a player (" + client.id +") connected, list of rooms: ")
		if (this.server.sockets.adapter)
			console.log(this.server.sockets.adapter.rooms)
		else
			console.log("undefined")
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
			this.state[roomId].players[client.data.number].vel = vel
	}
	
	startGameInterval(roomId: string) {
		const intervalId = setInterval(() => {
			const winner = this.game.gameLoop(this.state[roomId])
			if (!winner)
				this.emitGameState(roomId, this.state[roomId])
			else
			{
				this.emitGameOver(roomId, winner)
				this.state[roomId] = null
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
		this.server.to(roomId).emit("gameOver", JSON.stringify({winner}))
	}
	
	createGame(client: Socket)
	{
		// i have to understand if i can use socket default room
		const roomId : string = this.makeId(5)
		this.clientRooms[client.id] = roomId
		this.state[roomId] = this.game.initgame()

		client.join(roomId)
		client.data.number = 1
		client.emit('init', 1)
	}

	joinGame(client: Socket)
	{
		this.loopLimit++
		const rooms = this.server.sockets.adapter.rooms // da capire se ogni socket crea di default una room, in quel caso serve un array aggiuntivo delle mie room create
		if (Object.keys(rooms).length === 0 || this.loopLimit >= 20)
			return this.createGame(client)
		const randPick = Math.floor(Math.random() * Object.keys(rooms).length);
		const roomId = Object.keys(rooms)[randPick]
		const room = rooms[roomId]
		const numClients = Object.keys(room.sockets).length
		if (numClients === 1)
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
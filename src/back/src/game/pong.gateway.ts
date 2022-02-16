
const FRAME_RATE = 50

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket} from "socket.io";
import { PongService } from "./pong.service";

interface RoomState {
	[roomId: string] : {
		state: any,
		playerCount: number,
		moves: [{
			up: boolean,
			down: boolean
		},{
			up: boolean,
			down: boolean
		}]
	}
}

interface ClientRoom {
	[clientId: string] : string
}

interface RoomInterval {
	[roomId: string] : any
}

@WebSocketGateway({ cors : true , namespace : "pong"})
export default class PongGateway implements
	OnGatewayDisconnect, OnGatewayConnection {
		constructor(private readonly game: PongService){}
	
	private loopLimit = 0
	private clientRooms: ClientRoom = {} // works like a map, key=clientId, value=roomId
	private rooms: RoomState = {} // works like a map, key=roomId, value=room state & playerCount
	private roomIntervals : RoomInterval = {} //  works like a map, key=roomId, value=roomId
	
	@WebSocketServer()
	private server: Server;

	handleDisconnect(client: Socket) {
		const roomId = this.clientRooms[client.id]
		const winner = client.data.number === 1 ? 2 : 1

		this.endGame(roomId, winner)
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
		if (key === "ArrowUp")
			this.rooms[roomId].moves[client.data.number - 1].up = true
		else
			this.rooms[roomId].moves[client.data.number - 1].down = true
	}

	@SubscribeMessage('keyUp')
	handleKeyUp(
		@MessageBody() key: string,
		@ConnectedSocket() client: Socket
	){
		const roomId = this.clientRooms[client.id]
		if (!roomId)
			return
		if (key === "ArrowUp")
			this.rooms[roomId].moves[client.data.number - 1].up = false
		else
			this.rooms[roomId].moves[client.data.number - 1].down = false
	}
	
	startGameInterval(roomId: string) {
		this.roomIntervals[roomId] = setInterval(() => {
			const winner = this.game.gameLoop(this.rooms[roomId].state, this.rooms[roomId].moves)
			if (!winner)
				this.emitGameState(roomId, this.rooms[roomId].state)
			else
			{
				this.emitGameState(roomId, this.rooms[roomId].state)
				this.endGame(roomId, winner)
			}
		}, 1000 / FRAME_RATE)
	}

	endGame(roomId: string, winner: number)
	{
		this.emitGameOver(roomId, winner)
		delete this.rooms[roomId]
		clearInterval(this.roomIntervals[roomId])
		delete this.roomIntervals[roomId]
	}

	emitGameState(roomId: string, state: any)
	{
		this.server.to(roomId).emit("gameState", state)
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
		this.rooms[roomId] = {state: this.game.createGameState(), playerCount: 1, moves: [{up: false, down: false},{up: false, down: false}]}

		client.join(roomId)
		client.data.number = 1
		client.emit('init', 1)
	}

	joinGame(client: Socket)
	{
		console.log("joinGame")
		this.loopLimit++
		const available_rooms : string[] = Object.keys(this.rooms)
		if (available_rooms.length === 0 || this.loopLimit >= 20)
			return this.createGame(client)
		const randPick = Math.floor(Math.random() * available_rooms.length)
		const roomId = available_rooms[randPick]
		const room = this.rooms[roomId]
		if (room.playerCount === 1)
		{
			this.clientRooms[client.id] = roomId
			this.rooms[roomId].playerCount = 2
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
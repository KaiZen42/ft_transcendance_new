
const FRAME_RATE = 50

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket} from "socket.io";
import { PongService } from "./pong.service";

interface RoomState {
	[roomId: string] : {
		state: any,
		moves: [{
			up: boolean,
			down: boolean
		},{
			up: boolean,
			down: boolean
		}],
		users:[{
			username: string,
  			points: number,
  			avatar: string
		},
		{
			username: string,
  			points: number,
  			avatar: string
		}],
		intervalID: any
	}
}

interface ClientRoom {
	[clientId: string] : string
}

@WebSocketGateway({ cors : true , namespace : "pong"})
export default class PongGateway implements
	OnGatewayDisconnect {
		constructor(private readonly game: PongService){}
	
	private loopLimit = 0
	private clientRooms: ClientRoom = {} // works like a map, key=clientId, value=roomId
	private rooms: RoomState = {} // works like a map, key=roomId, value=room state & playerCount
	
	@WebSocketServer()
	private server: Server;

	handleDisconnect(client: Socket) {
		const roomId = this.clientRooms[client.id]
		const winner = client.data.number ? 0 : 1

		this.endGame(roomId, winner)
	}

	@SubscribeMessage('joinGame')
	handleJoinGame(
		@MessageBody() user: any,
		@ConnectedSocket() client: Socket
	){
		this.loopLimit = 0
		this.joinGame(client, user)
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
			this.rooms[roomId].moves[client.data.number].up = true
		else
			this.rooms[roomId].moves[client.data.number].down = true
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
			this.rooms[roomId].moves[client.data.number].up = false
		else
			this.rooms[roomId].moves[client.data.number].down = false
	}
	
	startGameInterval(roomId: string) {
		this.server.to(roomId).emit("players", this.rooms[roomId].users)
		this.rooms[roomId].intervalID = setInterval(() => {
			const winner = this.game.gameLoop(this.rooms[roomId].state, this.rooms[roomId].moves)
			if (!winner)
				this.emitGameState(roomId, this.rooms[roomId].state)
			else
			{
				this.emitGameState(roomId, this.rooms[roomId].state)
				this.endGame(roomId, winner-1)
			}
		}, 1000 / FRAME_RATE)
	}

	endGame(roomId: string, winner: number)
	{
		if (!this.rooms[roomId])
			return
		const scores : number[] = [this.rooms[roomId].state.players[0].score, this.rooms[roomId].state.players[1].score]
		this.emitGameOver(roomId, winner, scores)
		clearInterval(this.rooms[roomId].intervalID)
		delete this.rooms[roomId]
	}

	emitGameState(roomId: string, state: any)
	{
		this.server.to(roomId).emit("gameState", state)
	}

	emitGameOver(roomId: string, winner: number, scores: number[])
	{
		this.server.to(roomId).emit("gameOver", winner, scores)
	}
	
	createGame(client: Socket, user: any)
	{
		this.clientRooms[client.id] = client.id
		this.rooms[client.id] = {
			state: this.game.createGameState(),
			moves: [{up: false, down: false},{up: false, down: false}],
			users: [{...user}, undefined],
			intervalID: undefined
		}
		client.data.number = 0
		client.emit("playerNumber", 0)
	}

	joinGame(client: Socket, user: any)
	{
		this.loopLimit++
		const available_rooms : string[] = Object.keys(this.rooms)
		if (available_rooms.length === 0 || this.loopLimit >= 20)
			return this.createGame(client, user)
		const randPick = Math.floor(Math.random() * available_rooms.length)
		const roomId = available_rooms[randPick]
		const room = this.rooms[roomId]
		if (!room.users[1])
		{
			this.clientRooms[client.id] = roomId
			this.rooms[roomId].users[1] = {...user}
			client.join(roomId)
			client.data.number = 1
			client.emit("playerNumber", 1)

			this.startGameInterval(roomId)
		}
		else
			this.joinGame(client, user)
	}
}
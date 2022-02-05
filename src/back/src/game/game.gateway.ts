
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  interface GameInfo {
	gameId: string,
	playerOne: string,
	playerTwo: string,
	open: boolean
  }

  @WebSocketGateway({ cors : true , namespace : "game"})
  export class GameGateway implements
  	OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	private readonly gameList: GameInfo[] = []
	private gameCount: number = 0
	private loopLimit: number = 0
	@WebSocketServer()
	private readonly server: Server;
	
	handleDisconnect(client: any) {
		/* TODO richiamare la leave game qua, devo solo capire come passare i miei dati alla handleDisconnect,
			penso nel return della useEffect */
		console.log('a player disconnected.');
	}
	handleConnection(client: Socket) {
		console.log("a player connected")
	}
	afterInit(server: Server) {
		console.log("socket inizializzato da MATTIA");
	}
	
	createGame(body: any, client: Socket)
	{
		const gameId = (Math.random()+1).toString(36).slice(2, 18);
		console.log("Game Created by "+ body.username + " w/ " + gameId);
		this.gameList.push({gameId, playerOne: body.username, playerTwo: "", open : true})
		this.gameCount++;

		this.server.emit('gameCreated', {
			username: body.username,
			gameId: gameId
		});
	}

	isAlreadyInGame(body: any, client: Socket) : boolean
	{
		for (const game of this.gameList.values()) {
			if (game.playerOne === body.username || game.playerTwo === body.username)
			{
				console.log("This User already has a Game!");
				client.emit('alreadyJoined', {
					gameId: game.gameId
				});
				return true
			}			
		}
		return false
	}

	joinGame(body: any, client: Socket)
	{
		this.loopLimit++
		if (this.gameCount === 0 || this.loopLimit >= 20)
			return this.createGame(body, client)
		const randPick = Math.floor(Math.random() * this.gameCount);
		if (this.gameList[randPick].playerTwo === "")
		{
			this.gameList[randPick].playerTwo = body.username
			client.emit("joinSuccess", {
				gameId: this.gameList[randPick].gameId
			})
			console.log(body.username + " has been added to: " + this.gameList[randPick].gameId)
		}
		else
			this.joinGame(body, client)
	}

	@SubscribeMessage('joinGame')
	handleJoinGame(
		@MessageBody() body: any,
		@ConnectedSocket() client: Socket
	){
		if (this.isAlreadyInGame(body, client))
			return
		this.loopLimit = 0
		this.joinGame(body, client)
	}

	@SubscribeMessage('leaveGame')
	handleLeavevGame(
		@MessageBody() body: any,
		@ConnectedSocket() client: Socket
	){
		if (this.gameCount === 0)
			client.emit('notInGame');
		for (let index = 0; index < this.gameList.length; index++) {
			const game = this.gameList[index]
			if (game.playerOne === body.username || game.playerTwo === body.username)
			{
				--this.gameCount
				this.gameList.splice(index, 1)
				client.emit('leftGame', { gameId: game.gameId });
				this.server.emit('gameDestroyed', {gameId: game.gameId, gameOwner: body.username });
				return 
			}
		}
		client.emit('notInGame');
	}
}
const FRAME_RATE = 50;

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/models/user.entity';
import { UserService } from 'src/user/user.service';
import {
  ClientRoom,
  GameState,
  RoomStateMap,
} from './interfaces/pong.interfaces';
import { MatchService } from './match.service';
import { PongService } from './pong.service';

@WebSocketGateway({ cors: true, namespace: 'pong' })
export default class PongGateway implements OnGatewayDisconnect {
  constructor(
    private readonly game: PongService,
    private readonly match: MatchService,
    private readonly user: UserService,
  ) {}

  private loopLimit = 0;
  private clientRooms: ClientRoom = {}; // works like a map, key=clientId, value=roomId
  private rooms: RoomStateMap = {}; // works like a map, key=roomId, value=room state & playerCount

  @WebSocketServer()
  private server: Server;

  handleDisconnect(client: Socket) {
    const roomId = this.clientRooms[client.id];
    const winner = client.data.number ? 0 : 1;

    this.endGame(roomId, winner);
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { user, inverted } = data;

    console.log('USER: ', user);

    if (this.isAlreadyInGame(user.id)) {
      client.emit('alreadyInGame');
      return;
    }

    this.loopLimit = 0;
    this.joinGame(client, user, inverted);
  }

  @SubscribeMessage('watchGame')
  handleWatchGame(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const available_rooms: string[] = Object.keys(this.rooms);
    for (let i = 0; i < available_rooms.length; i++) {
      const roomId = available_rooms[i];
      if (
        this.rooms[roomId].users[0].id === userId ||
        this.rooms[roomId].users[1].id === userId
      ) {
        client.join(roomId);
        this.server.to(client.id).emit('players', this.rooms[roomId].users);
        return;
      }
    }
    client.emit('noGameFound');
  }

  @SubscribeMessage('createFriendlyMatch')
  handleCreateFriendlyMatch(
    @MessageBody() user: any,
    @ConnectedSocket() client: Socket,
  ) {
    if (this.rooms[client.id]) {
      client.emit('friendlyMatchExpired');
      return;
    }
    this.createGame(client, user, false, true);
  }

  @SubscribeMessage('acceptFriendlyMatch')
  handleAcceptFriendlyMatch(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { user, friendId } = data;
    const available_rooms: string[] = Object.keys(this.rooms);
    for (let i = 0; i < available_rooms.length; i++) {
      const roomId = available_rooms[i];
      if (
        this.rooms[roomId].friendly &&
        this.rooms[roomId].users[0].id === friendId &&
        !this.rooms[roomId].users[1]
      ) {
        this.clientRooms[client.id] = roomId;
        this.rooms[roomId].users[1] = { ...user };
        client.join(roomId);
        client.data.number = 1;
        client.emit('playerNumber', 1);

        this.startGameInterval(roomId);
        return;
      }
    }
    client.emit('friendlyMatchExpired');
  }

  @SubscribeMessage('keyDown')
  handleKeyDown(@MessageBody() key: string, @ConnectedSocket() client: Socket) {
    const roomId = this.clientRooms[client.id];
    if (!roomId) return;
    if (key === 'ArrowUp')
      this.rooms[roomId].moves[client.data.number].up = true;
    else this.rooms[roomId].moves[client.data.number].down = true;
  }

  @SubscribeMessage('keyUp')
  handleKeyUp(@MessageBody() key: string, @ConnectedSocket() client: Socket) {
    const roomId = this.clientRooms[client.id];
    if (!roomId) return;
    if (key === 'ArrowUp')
      this.rooms[roomId].moves[client.data.number].up = false;
    else this.rooms[roomId].moves[client.data.number].down = false;
  }

  isAlreadyInGame(id: number) {
    const available_rooms: string[] = Object.keys(this.rooms);
    for (let i = 0; i < available_rooms.length; i++) {
      const roomId = available_rooms[i];
      if (
        this.rooms[roomId].users[0].id === id ||
        (this.rooms[roomId].users[1] && this.rooms[roomId].users[1].id === id)
      )
        return true;
    }
    return false;
  }

  startGameInterval(roomId: string) {
    this.emitGameState(roomId, this.rooms[roomId].state);
    this.server.to(roomId).emit('players', this.rooms[roomId].users);
    setTimeout(() => {
      const intervalID = setInterval(() => {
        if (!this.rooms[roomId]) return;
        const winner = this.game.gameLoop(
          this.rooms[roomId].inverted,
          this.rooms[roomId].state,
          this.rooms[roomId].moves,
        );
        if (!winner) this.emitGameState(roomId, this.rooms[roomId].state);
        else {
          this.emitGameState(roomId, this.rooms[roomId].state);
          this.endGame(roomId, winner - 1);
        }
      }, 1000 / FRAME_RATE);
      if (this.rooms[roomId]) this.rooms[roomId].intervalID = intervalID;
    }, 3200);
  }

  async handleQuit(id: number) {
    const loser: User = await this.user.getById(id);
    const points = loser.points - 30 < 0 ? 0 : loser.points - 30;
    this.user.updatePoints(id, {
      points,
      wins: loser.wins,
      losses: loser.losses + 1,
    });
  }

  endGame(roomId: string, winner: number) {
    if (!this.rooms[roomId]) return;
    if (!this.rooms[roomId].users[1]) {
      delete this.rooms[roomId];
      return;
    }
    const scores: number[] = [
      this.rooms[roomId].state.players[0].score,
      this.rooms[roomId].state.players[1].score,
    ];
    if (scores[0] !== 5 && scores[1] !== 5) {
      scores[winner] = 5;
      scores[winner ? 0 : 1] = 0;
      this.handleQuit(this.rooms[roomId].users[winner ? 0 : 1].id);
    }
    this.emitGameOver(roomId, winner, scores);
    clearInterval(this.rooms[roomId].intervalID);
    const player1 = this.rooms[roomId].users[0].id;
    const player2 = this.rooms[roomId].users[1].id;
    this.match.create({
      player1,
      player2,
      points1: scores[0],
      points2: scores[1],
    });
    delete this.rooms[roomId];
  }

  emitGameState(roomId: string, state: GameState) {
    this.server.to(roomId).emit('gameState', state);
  }

  emitGameOver(roomId: string, winner: number, scores: number[]) {
    this.server.to(roomId).emit('gameOver', winner, scores);
  }

  createGame(client: Socket, user: User, inverted: boolean, friendly = false) {
    this.clientRooms[client.id] = client.id;
    this.rooms[client.id] = {
      state: this.game.createGameState(inverted),
      moves: [
        { up: false, down: false },
        { up: false, down: false },
      ],
      users: [{ ...user }, undefined],
      intervalID: undefined,
      friendly,
      inverted,
    };
    client.data.number = 0;
    client.emit('playerNumber', 0);
  }

  joinGame(client: Socket, user: User, inverted: boolean) {
    this.loopLimit++;
    const available_rooms: string[] = Object.keys(this.rooms);
    if (available_rooms.length === 0 || this.loopLimit >= 20)
      return this.createGame(client, user, inverted);
    const randPick = Math.floor(Math.random() * available_rooms.length);
    const roomId = available_rooms[randPick];
    const room = this.rooms[roomId];
    if (!room.users[1] && room.inverted === inverted && !room.friendly) {
      this.clientRooms[client.id] = roomId;
      this.rooms[roomId].users[1] = { ...user };
      client.join(roomId);
      client.data.number = 1;
      client.emit('playerNumber', 1);
      this.startGameInterval(roomId);
    } else this.joinGame(client, user, inverted);
  }
}

import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import {
  creationDto,
  JoinRoomDto,
  messageDto,
  OnlineMap,
  openRoomDto,
  viewRoomDto,
} from './dto/chat.dto';
import { Channel } from './models/channel.entity';

import { Message } from './models/message.entity';
import { ChannelService } from './service/channel.service';
import { MessageService } from './service/message.service';
import { PartecipantService } from './service/partecipant.service';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  onlines: OnlineMap = {};

  constructor(
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService,
    private readonly partService: PartecipantService,
  ) {}

  @WebSocketServer()
  server: Server;

  date: Date = new Date();

  private logger: Logger = new Logger('TestGateway');

  afterInit(server: Server) {
    this.logger.log('WS SERVER ON');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Chat::Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Chat::Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('channelMessage')
  recieveChannelMessage(
    client: Socket,
    mex: messageDto,
  ): WsResponse<messageDto> {
    const msg: Message = new Message();
    //this.logger.log(`MSG ID ${msg.id}`);
    msg.userId = mex.userId.id;
    msg.data = mex.data;
    msg.sendDate = this.date;
    msg.channelId = +mex.room;
    this.messageService.create(msg);
    this.server.to(mex.room).emit('message', mex);
    this.server.to(mex.room).emit('notification', mex);
    this.logger.log(
      `Data recived is: ${mex.data} From: ${mex.userId.id} to ${
        mex.room === undefined ? 'UNA' : mex.room
      }: ${mex.userId.username}`,
    );
    return { event: 'channelMessage', data: mex };
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    socket: Socket,
    data: creationDto,
  ): Promise<WsResponse<string>> {
    this.logger.log(`CREATE ROOM FORM DATA `, data);
    if (data.otherUser !== null && data.otherUser !== undefined) {
      const existChan = await this.channelService.getPrivateChanByUsersId(
        data.idUser,
        data.otherUser,
      );
      if (existChan !== undefined) {
        this.server.to(socket.id).emit('viewedRoom', existChan.id + '');
        return; //{event: "viewedRoom", data: "" + chan.id} ;
      }
    }
    const chan: Channel = new Channel();
    chan.isPrivate = data.otherUser !== undefined;
    chan.name = chan.isPrivate
      ? `${data.idUser}` + `${data.otherUser}`
      : data?.name;
    chan.pass = data?.pass;
    chan.mode = data.mode;

    chan.id = (
      await this.channelService.create(chan, [
        data.idUser,
        chan.isPrivate ? data.otherUser : null,
      ])
    ).id;

    socket.join('' + chan.id);

    //this.server.to(socket.id).emit('createdRoom', {room: "" + chan.id});
    if (chan.isPrivate)
      this.server.emit('createdPrivateRoom', {
        idUser: data.otherUser,
        room: '' + chan.id,
      });

    this.logger.log(
      `Channel created (${chan.isPrivate}): ID: ${chan.id} name ${chan.name} whith ${data.idUser} | ${data.otherUser}`,
    );
    return { event: 'createRoom', data: '' + chan.id };
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    client: Socket,
    data: JoinRoomDto,
  ): Promise<WsResponse<boolean>> {
    client.join(data.room);
    if (await this.partService.isPartecipant(+data.room, data.idUser)) {
      this.server.to(client.id).emit('createRoom', data.room);
      return { event: 'joinedStatus', data: true };
    } else if (await this.channelService.join(data)) {
      this.logger.log(`JOIN TO ${data.room} SUCCESS`);
      this.server.to(client.id).emit('createRoom', data.room);
      return { event: 'joinedStatus', data: true };
    }
    this.logger.log(`JOIN TO ${data.room} FAIL`);
    return { event: 'joinedStatus', data: false };
  }

  @SubscribeMessage('openRoom')
  openRoom(client: Socket, data: openRoomDto): WsResponse<boolean> {
    client.join(data.room);
    this.logger.log(`OPEN ${data.idUser} in ${data.room}`);
    return { event: 'openedRoom', data: true };
  }

  @SubscribeMessage('viewRoom')
  viewRoom(client: Socket, data: viewRoomDto): WsResponse<string> {
    //client.join(data.room);
    this.logger.log(`VIEWED REQEST ${data.idUser} in ${data.room}`);
    return { event: 'viewedRoom', data: '' + data.room };
  }

  @SubscribeMessage('offline')
  offline(client: Socket, id: number) {
    this.logger.log(`OFFLINE REQEST ${id}`);
    delete this.onlines[id];
    this.server.emit('areNowOffline', id);
  }

  @SubscribeMessage('online')
  online(client: Socket, userId: number) {
    this.onlines[userId] = userId;
    client.broadcast.emit('areNowOnline', userId);
  }

  @SubscribeMessage('WhoOnline')
  WhoOnline(client: Socket, userId: number): WsResponse<number[]> {
    this.online(client, userId);
    console.log('onlines', Object.values(this.onlines));
    return { event: 'areOnline', data: Object.values(this.onlines) };
  }

  @SubscribeMessage('InGame')
  NowInGame(client: Socket, userId: number) {
    this.onlines[userId] = -userId;
    this.server.emit('areNowInGame', userId);
  }

  @SubscribeMessage('NotInGame')
  NotInGame(client: Socket, userId: number) {
    this.onlines[userId] = userId;
    this.server.emit('areNotInGame', userId);
  }

  @SubscribeMessage('ban')
  ban(client: Socket, req: channelRequestDto) {
    //controlli
    //attuare richiesta
    //comunicazione ai membri
    this.server.to(req.channelId.toString()).emit('memberUpdate');
  }
}

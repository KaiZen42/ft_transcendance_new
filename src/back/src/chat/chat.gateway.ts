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
import { UserService } from 'src/user/user.service';
import {
  channelRequestDto,
  channelResponseDto,
  creationDto,
  JoinRoomDto,
  LeaveRoomDto,
  messageDto,
  OnlineMap,
  openRoomDto,
  updateChannelDto,
  viewRoomDto,
} from './dto/chat.dto';
import { Channel } from './models/channel.entity';

import { Message } from './models/message.entity';
import { ChannelService } from './service/channel.service';
import { MessageService } from './service/message.service';
import { PartecipantService } from './service/partecipant.service';

interface SocketMap {
  [id: number]: string;
}

@WebSocketGateway({ cors: true, namespace: 'api/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  onlines: OnlineMap = {};
  socketOnlines: SocketMap = {};

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
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
  async recieveChannelMessage(
    client: Socket,
    mex: messageDto,
  ): Promise<WsResponse<messageDto>> {
    const sender = await this.partService.getPartecipantByUserAndChan(
      mex.userId.id,
      +mex.room,
    );
    const ch = await this.channelService.getById(+mex.room);
    //TODO: add mute option
    if (sender.mod === 'b') {
      mex.userId.id = -1;
      mex.data =
        ch !== undefined && !ch.isPrivate
          ? `you are banned from this channel`
          : `you are blocked`;
      this.server.to(client.id).emit('message', mex);
      return;
    }

    const msg: Message = new Message();
    //this.logger.log(`MSG ID ${msg.id}`);
    msg.userId = mex.userId.id;
    msg.data = mex.data;
    msg.sendDate = this.date;
    msg.channelId = +mex.room;
    this.messageService.create(msg);
    this.server.to(mex.room).emit('message', mex);
    // this.server.to(mex.room).emit('notification', mex);
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
    const user = await this.partService.getPartecipantByUserAndChan(
      data.idUser,
      +data.room,
    );
    if (user !== undefined && user.mod !== 'b') {
      this.server.to(client.id).emit('createRoom', data.room);
      return { event: 'joinedStatus', data: true };
    } else if (user === undefined && (await this.channelService.join(data))) {
      this.logger.log(`JOIN TO ${data.room} SUCCESS`);
      //client.join(data.room);
      this.server.to(client.id).emit('createRoom', data.room);
      return { event: 'joinedStatus', data: true };
    }
    this.logger.log(`JOIN TO ${data.room} FAIL`);
    return { event: 'joinedStatus', data: false };
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(client: Socket, data: number | openRoomDto) {
    if (typeof data === 'number') {
      console.log('LEAVE BECAUSE YES ', data);
      client.leave(data + '');
      this.server.to(client.id).emit('QuitRoom', data);
    } else {
      console.log('LEAVE BECAUSE LEAVE', data);
      await this.partService.delete(
        (
          await this.partService.getPartecipantByUserAndChan(
            data.idUser,
            +data.room,
          )
        ).id,
      );
      if ((await this.partService.FixAdmin(+data.room)) === undefined)
        this.channelService.delete(+data.room);
      this.server.to(client.id).emit('QuitRoom', +data.room);
    }
    this.server.to(client.id).emit('viewedRoom', '');
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
    delete this.socketOnlines[id];
    this.server.emit('areNowOffline', id);
  }

  @SubscribeMessage('online')
  online(client: Socket, userId: number) {
    this.onlines[userId] = userId;
    this.socketOnlines[userId] = client.id;
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

  @SubscribeMessage('BlockUser')
  async blockUsser(client: Socket, data: channelRequestDto) {
    const ch = await this.channelService.getById(data.channelId);
    console.log('BLOCK');
    if (ch.isPrivate) {
      const sender = await this.partService.getPartecipantByUserAndChan(
        data.sender,
        data.channelId,
      );
      const reciver = await this.partService.getPartecipantByUserAndChan(
        data.reciver,
        data.channelId,
      );
      if (sender !== undefined && reciver !== undefined) {
        if (data.type === 'Block')
          await this.partService.update(reciver.id, { mod: 'b' });
        else await this.partService.update(reciver.id, { mod: 'm' });
        this.logger.log(
          '[' +
            data.channelId +
            '] ' +
            data.sender +
            ' ' +
            data.type +
            ' ' +
            data.reciver,
        );
        const response: channelResponseDto = {
          reciver: data.reciver,
          reciverName: (await this.userService.getById(data.reciver)).username,
          type: data.type,
          room: data.channelId,
        };

        this.server
          .to(data.channelId.toString())
          .emit('messageUpdate', response);
      }
    }
  }

  @SubscribeMessage('ChannelRequest')
  async execRequest(client: Socket, req: channelRequestDto) {
    const sender = await this.partService.getPartecipantByUserAndChan(
      req.sender,
      req.channelId,
    );
    const reciver = await this.partService.getPartecipantByUserAndChan(
      req.reciver,
      req.channelId,
    );
    //controlli
    this.logger.log(
      'in chan [' +
        req.channelId +
        '] ' +
        req.sender +
        ' try to ' +
        req.type +
        ' ' +
        req.reciver,
    );
    if (
      sender.mod === 'b' ||
      sender.mod === 'm' ||
      reciver.mod === 'o' ||
      (req.type === 'upgrade' &&
        (reciver.mod === 'a' || reciver.mod === 'b')) ||
      (req.type === 'downgrade' && (reciver.mod === 'm' || reciver.mod === 'b'))
    )
      return;

    this.logger.log(
      'in chan [' +
        req.channelId +
        '] ' +
        req.sender +
        ' has ' +
        req.type +
        'ed ' +
        req.reciver,
    );
    //attuare richiesta
    switch (req.type) {
      case 'ban':
        await this.partService.update(reciver.id, { mod: 'b' });
        break;
      case 'kick':
        await this.partService.delete(reciver.id);
        break;
      case 'upgrade':
        await this.partService.update(reciver.id, { mod: 'a' });
        break;
      case 'downgrade':
        await this.partService.update(reciver.id, { mod: 'm' });
        break;
      case 'downgrade':
        await this.partService.update(reciver.id, { mod: 'm' });
        break;
      case 'mute':
        //TODO: mute
        break;
    }

    //comunicazione ai membri
    const response: channelResponseDto = {
      reciver: req.reciver,
      reciverName: (await this.userService.getById(req.reciver)).username,
      type: req.type,
      room: req.channelId,
    };
    this.server.to(req.channelId.toString()).emit('memberUpdate', response);
    this.server.to(req.channelId.toString()).emit('messageUpdate', response);

    //this.server.to(req.channelId.toString()).emit('memberNotification', response);
  }

  @SubscribeMessage('friendlyMatch')
  handleFriendlyMatch(
    @MessageBody()
    data: {
      requesting: { id: number; username: string };
      receving: number;
    },
  ) {
    const receivingId = this.socketOnlines[data.receving];
    this.server.to(receivingId).emit('friendlyMatch', data.requesting);
  }

  //this.server.to(req.channelId.toString()).emit('memberNotification', response);

  @SubscribeMessage('DeleteChan')
  async deleteRoom(client: Socket, data: viewRoomDto) {
    this.logger.log(`DELETE REQEST ${data.idUser} in ${data.room}`);
    const sender = await this.partService.getPartecipantByUserAndChan(
      data.idUser,
      +data.room,
    );
    if (sender !== undefined && sender.mod === 'o') {
      const response: channelResponseDto = {
        reciver: -1,
        reciverName: '',
        type: 'delete',
        room: +data.room,
      };

      this.logger.log(`DELETE REQEST ACCEPTED`);
      await this.partService.deleteAllByChan(+data.room);
      await this.messageService.deleteByChan(+data.room);
      await this.channelService.delete(+data.room);
      this.server.to(data.room).emit('deleted', +data.room);
      this.server.to(data.room).emit('messageUpdate', response);
    }
  }

  @SubscribeMessage('ChangeRoomSettings')
  async changeRoomSettings(client: Socket, data: updateChannelDto) {
    this.logger.log(`CHANGE REQEST ${data.userId} in ${data.id}`);
    const sender = await this.partService.getPartecipantByUserAndChan(
      data.userId,
      +data.id,
    );
    if (sender !== undefined && (sender.mod === 'o' || sender.mod === 'a')) {
      this.logger.log(`CHANGE REQEST ACCEPTED`);
      await this.channelService.updateChannel(data);
      this.server.to(data.id.toString()).emit('ChangedRoomSettings', {
        id: data.id,
        name: data.name,
        mode: data.mode,
      });
    }
  }
}

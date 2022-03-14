import { Controller, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { chatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './service/message.service';
import { Message } from './models/message.entity';
import { PartecipantService } from './service/partecipant.service';
import { ChannelService } from './service/channel.service';
import { Partecipant } from './models/partecipant.entity';
import { Channel } from './models/channel.entity';
import { RelationModule } from 'src/relation/relation.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Message, Partecipant, Channel]),
  ],
  controllers: [chatController],
  providers: [ChatGateway, MessageService, PartecipantService, ChannelService],
})
export class ChatModule {}

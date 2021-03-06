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
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Message, Partecipant, Channel]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
    }),
  ],
  controllers: [chatController],
  providers: [ChatGateway, MessageService, PartecipantService, ChannelService],
})
export class ChatModule {}

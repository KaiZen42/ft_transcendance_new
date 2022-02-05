import { Controller, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { chatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { Message } from './models/message.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Message])],
  controllers: [chatController], 
  providers: [ChatGateway, MessageService],
})
export class ChatModule {}


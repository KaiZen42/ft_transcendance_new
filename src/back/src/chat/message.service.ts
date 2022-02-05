import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Query
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Channels } from './models/channel.entity';
import { Message } from './models/message.entity';
import { messageDto } from './dto/message.dto';
  
  @Injectable()
  export class MessageService {
	constructor(
	  @InjectRepository(Message) private readonly messageDB: Repository<Message>,
	) {}
  
	async getAll(): Promise<Message[]> {
	  return this.messageDB.find();
	}
  
	async getByUser(userId: number): Promise<Message[]> {
	  return this.messageDB.find({ where: { userId } });
	}
  
	async getByChannel(channelId: number): Promise<Message[]> {
	  return this.messageDB.find({ where: { channelId } });
	}
  
	async create(message: Message): Promise<Message> {
	  return this.messageDB.save({
		userId: message.userId,
		//channelId: message.channelId,
		data: message.data,
		sendDate: message.sendDate,
	  });
	}

	async delete(id: number) {
	  return this.messageDB.delete({ id });
	}
  

  }
  
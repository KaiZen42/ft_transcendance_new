import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Query
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Channel } from '../models/channel.entity';
import { Message } from '../models/message.entity';
import { Partecipant } from '../models/partecipant.entity';
import { MessageService } from './message.service';
import { PartecipantService } from './partecipant.service';
  

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel) private readonly channelDB: Repository<Channel>,
		private readonly partService: PartecipantService,
		private readonly msgService: MessageService) 
		{}

	async getById(id : number) : Promise<Channel>
	{
		return this.channelDB.findOne({ where: { id } });
	}

	async getAllPart(id : number) : Promise<Partecipant[]>
	{
		return this.partService.getByChannel(id);
	}

	async getAllMessage(id : number) : Promise<Message[]>
	{
		return this.msgService.getByChannel(id);
	}

	async create(channel: Channel): Promise<Channel> {
		return this.channelDB.save({
			name : channel.name,
			mode : channel.mode,
			pass : channel.pass,
			isPrivate : channel.isPrivate,
		});
		}
	
}
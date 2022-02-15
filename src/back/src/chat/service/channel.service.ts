import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Query
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { getConnection, Repository } from 'typeorm';
import { ChannelInfo } from '../dto/chat.dto';

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

	async getChanByUser(id : number) : Promise<ChannelInfo[]>
	{
		const res : ChannelInfo[] =  await this.channelDB
			.createQueryBuilder("channel")
			.leftJoinAndSelect(Partecipant, "partecipant", "partecipant.userId  = :userId AND partecipant.channelId = channel.id", {userId : id})
			.select("partecipant.channelId")
			.addSelect(['channel.id', "channel.name", "channel.isPrivate"])
			.orderBy("channel.id", "ASC")
			.getMany()
		console.log("RES: ", res);
		return res;
	}

	async getAllMessage(id : number) : Promise<Message[]>
	{
		return this.msgService.getByChannel(id);
	}

	async create(channel: Channel, userId: number[]): Promise<Channel> {
		const ch: Channel = await this.channelDB.save({
			id:	channel.id,
			name : channel.name,
			mode : channel.mode,
			pass : channel.pass,
			isPrivate : channel.isPrivate,
		});

		this.partService.create(
			{
				id : 0,
				userId: userId[0],
				channelId: ch.id,
				muted: 0,
				mod: "m",
			});

		if (ch.isPrivate)
			this.partService.create(
				{
					id : 0,
					userId: userId[1],
					channelId: ch.id,
					muted: 0,
					mod: "m",
				});
		console.log(ch);
		return ch;
		}
	
}
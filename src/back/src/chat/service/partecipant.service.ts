import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Query
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Channel } from '../models/channel.entity';
import { Partecipant } from '../models/partecipant.entity';
  
  @Injectable()
  export class PartecipantService {
	constructor(
	  @InjectRepository(Partecipant) private readonly partecipantDB: Repository<Partecipant>,
	) {}
  
	async getAll(): Promise<Partecipant[]> {
	  return this.partecipantDB.find();
	}
  
	async getByUser(userId: number): Promise<Partecipant[]> {
	  return this.partecipantDB.find({ where: { userId } });
	}
  
	/* async getChannelFromUser(userId: number) : Promise<any[]>
	{
		const res =  await this.partecipantDB
			.createQueryBuilder("partecipant")
			//non cé bisogno di questa => .leftJoinAndSelect("partecipant.userId", "user", "partecipant.userId = :userId", {userId : userId})
			//.leftJoinAndSelect("partecipant.channel", "channel.id")
			.leftJoinAndSelect(Channel, "channel", "partecipant.channel = channel.id")
			.where("partecipant.userId = :userId", {userId : userId})
			.select("partecipant.channel")
			.addSelect(['channel.id', "channel.name", "channel.isPrivate"])
			//.select("partecipant")
			//.orderBy("partecipant.id", "ASC")
			//.getMany()
			.getRawMany()
			//channel_name: '8033680336',
			//channel_isPrivate: true,
			//channelId: 1
		return res;
	} */
	
	async getByChannel(channelId: number): Promise<Partecipant[]> {
	  return this.partecipantDB.find({ where: { channelId } });
	}
  
	async create(partecipant: Partecipant): Promise<Partecipant> {
	  return this.partecipantDB.save({
		userId: partecipant.userId,
		channel: partecipant.channelId,
		muted : partecipant.muted,
		mod : partecipant.mod,
	  });
	}

	async delete(id: number) {
	  return this.partecipantDB.delete({ id });
	}
  }
  
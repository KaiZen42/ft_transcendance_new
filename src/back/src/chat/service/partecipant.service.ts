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
  

	
	async getByChannel(channelId: number): Promise<Partecipant[]> {
	  return this.partecipantDB.find({ where: { channelId } });
	}

	async isPartecipant(channelId: number, userId: number): Promise<boolean> {
		const ret = await this.partecipantDB.findOne({ where: { channelId, userId } });
		return (ret !== undefined )
	}

	async getPartecipantByUserAndChan( userId: number, channelId: number): Promise<Partecipant> {
		const ret = await this.partecipantDB.findOne({ where: { channelId, userId } });
		console.log("daje un po", ret)
		return ret;
	}
  
	async create(partecipant: Partecipant): Promise<Partecipant> {
	  return this.partecipantDB.save({
		userId: partecipant.userId,
		channelId: partecipant.channelId,
		muted : partecipant.muted,
		mod : partecipant.mod,
	  });
	}

	async delete(id: number) {
	  return this.partecipantDB.delete({ id });
	}
  }
  
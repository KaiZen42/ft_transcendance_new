import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Query
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.entity';
  import { EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
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
  
	async getUsersIdByChan(channelId: number) : Promise<any[]>
	{
		//const res = await this.partecipantDB.find({ select:["userId"] ,where: {channelId}})
		const res: any[] = await getRepository(User)
		.createQueryBuilder("users")
		.leftJoin(Partecipant, "partecipant", "partecipant.userId = users.id")
		.where("partecipant.channelId = :chId", {chId: channelId})
		.select("users.id")
		.getMany();
		
		return res.map(r => r.id);
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
  
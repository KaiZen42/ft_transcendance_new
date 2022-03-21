import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Query
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { channel } from 'diagnostics_channel';
import { userInfo } from 'os';
import { User } from 'src/user/models/user.entity';
  import { getConnection, getRepository, Like, Repository } from 'typeorm';
import { ChannelInfoDto, JoinRoomDto, updateChannelDto } from '../dto/chat.dto';

import { Channel } from '../models/channel.entity';
import { Message } from '../models/message.entity';
import { Partecipant } from '../models/partecipant.entity';
import { MessageService } from './message.service';
import { PartecipantService } from './partecipant.service';
  

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel) private readonly channelDB: Repository<Channel>,
		private readonly  partService: PartecipantService,
		private readonly msgService: MessageService) 
		{}

	async getById(id : number) : Promise<Channel>
	{
		return this.channelDB.findOne({ where: { id } });
	}

	async getByName(name : string) : Promise<any[]>
	{
		const res =  await this.channelDB
			.createQueryBuilder("channel")
			.select(["channel.id", "channel.name", "channel.mode"])
			.where(`channel.name LIKE '${name}%'`)
			.andWhere(" channel.isPrivate = false ")
			.andWhere(" channel.mode != 'PRI'")
			.orderBy("channel.name", "ASC")
			.getMany()
		////console.log("CHANNEL INFO", res)
		return res;
	}

	async getAllPart(id : number) : Promise<Partecipant[]>
	{
		return this.partService.getByChannel(id);
	}

	async getChanByUser(id : number) : Promise<any[]>
	{
		const res =  await this.channelDB
			.createQueryBuilder("channel")
			.leftJoinAndSelect(Partecipant, "partecipant", "partecipant.userId  = :userId AND partecipant.channelId = channel.id", {userId : id})
			.select("partecipant.channelId")
			.addSelect(['channel.id', "channel.name", "channel.isPrivate"])
			.orderBy("channel.id", "ASC")
			.getMany()
		////console.log("CHANNEL INFO", res)
		return res;
	}

	async getInfoChanByUser(id : number) : Promise<any[]>
	{
		const res = await this.channelDB
		.createQueryBuilder("channel")
		.where(qb => {
			const subQuery = qb.subQuery()
				.select(["channel.id"])
				.from(Channel, "channel")
				.leftJoin("channel.partecipants", "partecipant", "partecipant.channelId = channel.id")
				.where("partecipant.userId = :userId AND partecipant.mod != 'b'", {userId: id})
				.getQuery();
			return "channel.id IN " + subQuery;
		})
		.select(['channel.id', "channel.name", "channel.isPrivate", "channel.mode", "partecipant.id", "users.id", "users.username", "users.avatar"  ])
		.leftJoin("channel.partecipants", "partecipant")
		.leftJoin("partecipant.userId", "users" )
		.orderBy("channel.id", "ASC")
		.getMany()
		// //console.log("CHANNEL INFO", res)
		 return res;
	}

	async getInfoChanById(id : number) : Promise<any>
	{
		const res = await this.channelDB
		.createQueryBuilder("channel")
		.where("channel.id = :chId ", {chId: id})
		.select(['channel.id', "channel.name", "channel.isPrivate",  "partecipant.id", "users.id", "users.username", "users.avatar"  ])
		.leftJoin("channel.partecipants", "partecipant")
		.leftJoin("partecipant.userId", "users" )
		.getOne()
		// //console.log("CHANNEL INFO", res)
		 return res;
	}

	
	async getUserByChan(id: number) : Promise<User[]>
	{
		const res = await getRepository(User)
			.createQueryBuilder("users")
			.leftJoinAndSelect(Partecipant, "partecipant", "partecipant.userId = users.id")
			.where("partecipant.channelId = :chId", {chId: id})
			.getMany();
		//console.log("user by chan", res)
		return res;
	}

	

	async getOtherByChan(id: number , userId: number) : Promise<User>
	{
		const res = await getRepository(User)
			.createQueryBuilder("users")
			.leftJoinAndSelect(Partecipant, "partecipant", "partecipant.userId = users.id AND users.id != :userId",{ userId: userId})
			.where("partecipant.channelId = :chId ", {chId: id})
			.getOne()
		return res;
	}

	async getChanName(id: number , userId: number) : Promise<any>
	{
		const res: any = await getRepository(User)
			.createQueryBuilder("users")
			.leftJoinAndSelect(Partecipant, "partecipant", "partecipant.userId = users.id AND users.id != :userId",{ userId: userId})
			.where("partecipant.channelId = :chId ", {chId: id})
			.getOne()
		return res;
	}

	async getPrivateChanByUsersId(userId1: number, userId2: number): Promise<any> {
		const res = await this.channelDB
		.createQueryBuilder("channel")
		.select("channel.id")
		.where(qb => {
			const subQuery = qb.subQuery()
			.select(["channel.id"])
			.from(Channel, "channel")
			.leftJoin("channel.partecipants", "partecipant",  
				"partecipant.userId  = :userId1 AND partecipant.channelId = channel.id", {userId1})
			.where("partecipant.userId = :userId1", {userId1})
			.getQuery();
			return "channel.id IN (" + subQuery +")";
		})
		
		.leftJoin("channel.partecipants", "partecipant",  
			"partecipant.userId  = :userId2 AND partecipant.channelId = channel.id", {userId2})
		.andWhere("partecipant.userId = :userId2 AND channel.isPrivate = true", {userId2} )
		.getOne()
		return (res) 
	}

	async getAllMessage(id : number) : Promise<Message[]>
	{
		return this.msgService.getByChannel(id);
	}
/* 
	async goOnline(userId: number)
	{
		
		await this.partService.create(
			{
				id : 0,
				userId: userId,
				channelId: 1,
				muted: -1,
				mod: "m",
			});
	} */

	async goOffline(userId: number)
	{
		const part = (await this.partService.getPartecipantByUserAndChan(userId, 1));
		//console.log("" + userId + " FOUND: ", part)
		if (part !== undefined)
			await this.partService.delete(part.id);
	}

/* 	async allOffline()
	{
		(await this.partService.getByChannel(1)).map(
			(part: Partecipant) => {this.partService.delete(part.id)}
		)
	} */

	

	async join(data: JoinRoomDto): Promise<boolean>
	{
		const ch:Channel = await this.getById(+data.room);
		//console.log("JOIN ", ch)
		if ( ch === undefined || ch.isPrivate )
			return false;
		if ( ch.mode === "PRO" && ch.pass !== data.key )
			return false;

		await this.partService.create(
			{
				id : 0,
				userId: data.idUser,
				channelId: ch.id,
				muted: 0,
				mod: "m",
			});
		return true;
	}


	async create(channel: Channel, userId: number[]): Promise<Channel> {
		const ch: Channel = await this.channelDB.save({
			id:	channel.id,
			name : channel.name,
			mode : channel.mode,
			pass : channel.pass,
			isPrivate : channel.isPrivate,
		});
		if (userId.length > 0)
			await this.partService.create(
			{
				id : 0,
				userId: userId[0],
				channelId: ch.id,
				muted: 0,
				mod: (ch.isPrivate) ? "m" : "o",
			});

		if (ch.isPrivate)
			await this.partService.create(
				{
					id : 0,
					userId: userId[1],
					channelId: ch.id,
					muted: 0,
					mod: "m",
				});
		//console.log(ch);
		return ch;
		}

		async delete(id: number) {
			return this.channelDB.delete({ id });
		}

		async updateChannel(toUpdate: updateChannelDto)
		{
			//console.log(toUpdate);
			if (toUpdate.pass === undefined)
				await this.channelDB
				.createQueryBuilder()
				.update(Channel)
				.set({name: toUpdate.name, mode: toUpdate.mode})
				.where("Channel.id = :uId", {uId: toUpdate.id})
				.execute()
			else
				await this.channelDB
				.createQueryBuilder()
				.update(Channel)
				.set({name: toUpdate.name, mode: toUpdate.mode, pass: toUpdate.pass})
				.where("Channel.id = :uId", {uId: toUpdate.id})
				.execute()
			
		}
}
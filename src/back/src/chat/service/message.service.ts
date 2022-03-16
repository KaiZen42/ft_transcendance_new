import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.entity';
import { getConnection, Repository } from 'typeorm';
import { Message } from '../models/message.entity';

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
    let res: Message[] = await this.messageDB
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.userId', 'user')
      .innerJoinAndSelect('message.channelId', 'channel')
      .where('message.channelId = :idd', { idd: channelId })
      .select(['user.id', 'user.username', 'message'])
      .orderBy('message.id', 'ASC')
      .getMany();

    /* .createQueryBuilder("message")
		.leftJoinAndSelect("message.userId", "user")
		.where("message.channelId = :id", {id: channelId})
		.select(["message.id","message.userId","message.userName","message.data"])
		.getRawMany() */
    return res;
  }

  async getCounterByChannel(channelId: number): Promise<number> {
    let res: number = await this.messageDB
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.userId', 'user')
      .innerJoinAndSelect('message.channelId', 'channel')
      .where('message.channelId = :idd', { idd: channelId })
      .select(['user.id', 'user.username', 'message'])
      .getCount();

    /* .createQueryBuilder("message")
		.leftJoinAndSelect("message.userId", "user")
		.where("message.channelId = :id", {id: channelId})
		.select(["message.id","message.userId","message.userName","message.data"])
		.getRawMany() */
    return res;
  }

  async create(message: Message): Promise<Message> {
    return this.messageDB.save({
      userId: message.userId,
      channelId: message.channelId,
      data: message.data,
      sendDate: message.sendDate,
    });
  }

  async delete(id: number) {
    return this.messageDB.delete({ id });
  }

  async deleteByChan(idC: number) {
    await this.messageDB
      .createQueryBuilder('message')
      .delete()
      .from(Message)
      .where('channelId = :idC', { idC })
      .execute();
  }
}

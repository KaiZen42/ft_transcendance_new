import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.entity';
import {
  EntityRepository,
  getConnection,
  getRepository,
  Not,
  Repository,
} from 'typeorm';
import { Channel } from '../models/channel.entity';
import { Message } from '../models/message.entity';
import { Partecipant } from '../models/partecipant.entity';
import { ChannelService } from './channel.service';
import { MessageService } from './message.service';

@Injectable()
export class PartecipantService {
  constructor(
    @InjectRepository(Partecipant)
    private readonly partecipantDB: Repository<Partecipant>,
    private readonly messageService: MessageService,
  ) {}

  async getAll(): Promise<Partecipant[]> {
    return this.partecipantDB.find();
  }

  async getByUser(userId: number): Promise<Partecipant[]> {
    return this.partecipantDB.find({ where: { userId } });
  }

  async getUsersIdByChan(channelId: number): Promise<any[]> {
    //const res = await this.partecipantDB.find({ select:["userId"] ,where: {channelId}})
    const res: any[] = await getRepository(User)
      .createQueryBuilder('users')
      .leftJoin(Partecipant, 'partecipant', 'partecipant.userId = users.id')
      .where('partecipant.channelId = :chId', { chId: channelId })
      .select('users.id')
      .getMany();

    return res.map((r) => r.id);
  }

  async FixAdmin(channelId: number): Promise<Partecipant> {
    let res = await this.partecipantDB
      .createQueryBuilder('partecipant')
      .select("partecipant")
      .where("partecipant.channelId = :chId AND (partecipant.mod = 'a' OR partecipant.mod = 'o')", {
        chId: channelId,
      })
      .getOne();

    //console.log("adbmin", res)
    if (res === undefined)
    {
      res = await this.partecipantDB.findOne({ where: { channelId , mod: Not("b")} });
      if (res !== undefined)
        await this.update(res.id, {mod: "a"})
      else
        await this.messageService.deleteByChan(channelId)
    }
    //console.log('ret:', res);
    return res;
  }

  async getByChannel(channelId: number): Promise<Partecipant[]> {
    return this.partecipantDB.find({ where: { channelId } });
  }

  async getCompletePartecipantByChannel(channelId: number): Promise<any[]> {
    const res: any[] = await this.partecipantDB
      .createQueryBuilder('partecipant')
      .select(['partecipant', 'users'])
      .leftJoinAndSelect(
        'partecipant.userId',
        'users',
        'users.id = partecipant.userId',
      )
      .where("partecipant.channelId = :chId AND partecipant.mod != 'b'", {
        chId: channelId,
      })
      .getMany();
    //console.log('ret:', res);
    return res;
  }

  async isPartecipant(channelId: number, userId: number): Promise<boolean> {
    const ret = await this.partecipantDB.findOne({
      where: { channelId, userId },
    });
    return ret !== undefined;
  }

  async getPartecipantByUserAndChan(
    userId: number,
    channelId: number,
  ): Promise<Partecipant> {
    const ret = await this.partecipantDB.findOne({
      where: { channelId, userId },
    });
    return ret;
  }

  async create(partecipant: Partecipant): Promise<Partecipant> {
    return this.partecipantDB.save({
      userId: partecipant.userId,
      channelId: partecipant.channelId,
      muted: partecipant.muted,
      mod: partecipant.mod,
    });
  }

  async delete(id: number) {
    return this.partecipantDB.delete({ id });
  }

  async deleteAllByChan(chanId: number) {
    return await this.partecipantDB
      .createQueryBuilder()
      .delete()
      .from(Partecipant)
      .where('channelId = :chId', { chId: chanId })
      .execute();
  }

  async update(id: number, data: any) {
    const res = await this.partecipantDB
      .createQueryBuilder()
      .update(Partecipant)
      .set({ ...data })
      .where('partecipant.id = :uId', { uId: id })
      .execute();
      //console.log("UPDATE PART: ", res)
  }
}

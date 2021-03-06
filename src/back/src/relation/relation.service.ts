import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRelationDto } from './dto/create-relation.dto';
import { Relation, Status } from './models/relation.entity';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(Relation)
    private readonly relationDB: Repository<Relation>,
  ) {}

  async create(relationData: CreateRelationDto): Promise<Relation> {
    const relation = await this.getFriendStatus(
      relationData.requesting,
      relationData.receiving,
    );
    if (relation) return;
    return this.relationDB.save({
      requesting: relationData.requesting,
      receiving: relationData.receiving,
      status: Status.REQUESTED,
    });
  }

  async findRequests(id: number): Promise<Relation[]> {
    return this.relationDB
      .createQueryBuilder('relation')
      .leftJoinAndSelect(
        'relation.requesting',
        'users',
        'relation.requesting = users.id',
      )
      .select(['relation', 'users.id', 'users.username', 'users.avatar'])
      .where("relation.receiving = :userId AND relation.status = 'REQUESTED'", {
        userId: id,
      })
      .getMany();
  }

  async acceptRequest(id: number) {
    await this.relationDB.save({ id, status: Status.FRIENDS });
  }

  async unfriend(id: number) {
    await this.relationDB.delete({ id });
  }

  async getFriends(id: number) {
    return this.relationDB
      .createQueryBuilder('relation')
      .leftJoinAndSelect(
        'relation.requesting',
        'users1',
        'relation.requesting = users1.id',
      )
      .leftJoinAndSelect(
        'relation.receiving',
        'users2',
        'relation.receiving = users2.id',
      )
      .select([
        'relation',
        'users2.id',
        'users2.username',
        'users2.avatar',
        'users1.id',
        'users1.username',
        'users1.avatar',
      ])
      .where(
        "(users1.id = :userId OR users2.id = :userId) AND relation.status = 'FRIENDS'",
        { userId: id },
      )
      .getMany();
  }

  async getFriendStatus(id1: number, id2: number) {
    return this.relationDB
      .createQueryBuilder('relation')
      .leftJoinAndSelect(
        'relation.requesting',
        'users1',
        'relation.requesting = users1.id',
      )
      .leftJoinAndSelect(
        'relation.receiving',
        'users2',
        'relation.receiving = users2.id',
      )
      .select(['relation.status'])
      .where(
        '(users1.id = :id1 AND users2.id = :id2) OR (users1.id = :id2 AND users2.id = :id1)',
        { id1, id2 },
      )
      .getOne();
  }
}

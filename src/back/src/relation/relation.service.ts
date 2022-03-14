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
      .select(['relation', 'users.username', 'users.avatar'])
      .where("relation.receiving = :userId AND relation.status = 'REQUESTED'", {
        userId: id,
      })
      .getMany();
  }

  async acceptRequest(id: number) {
    const res = this.relationDB.save({ id, status: Status.FRIENDS });
    console.log(res);
  }

  async unfriend(id: number) {
    const res = this.relationDB.delete({ id });
    console.log(res);
  }
}

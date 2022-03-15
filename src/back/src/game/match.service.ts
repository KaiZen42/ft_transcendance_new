import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './models/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchDB: Repository<Match>,
  ) {}

  async create(matchData: CreateMatchDto): Promise<Match> {
    return this.matchDB.save({
      ...matchData,
    });
  }

  async getByPlayerId(id: number): Promise<Match[]> {
    return this.matchDB
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.player1', 'users1', 'match.player1 = users1.id')
      .leftJoinAndSelect('match.player2', 'users2', 'match.player2 = users2.id')
      .select([
        'match',
        'users2.id',
        'users2.username',
        'users2.avatar',
        'users1.id',
        'users1.username',
        'users1.avatar',
      ])
      .where('users1.id = :userId OR users2.id = :userId', { userId: id })
      .orderBy('match.id', 'DESC')
      .limit(10)
      .getMany();
  }
}

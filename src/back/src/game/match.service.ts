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
    return this.matchDB.find({
      where: [{ player1: id }, { player2: id }],
    });
  }
}

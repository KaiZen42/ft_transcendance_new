import { Controller, Get, Param, Res } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './models/match.entity';

@Controller('matches')
export class MatchController {
  constructor(private readonly match: MatchService) {}

  @Get('player/:id')
  async getByEmail(@Param('id') id: number): Promise<Match[]> {
    return await this.match.getByPlayerId(id);
  }
}

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MatchService } from './match.service';
import { Match } from './models/match.entity';

@Controller('matches')
@UseGuards(AuthGuard)
export class MatchController {
  constructor(private readonly match: MatchService) {}

  @Get('player/:id')
  async getByEmail(@Param('id') id: number): Promise<Match[]> {
    return await this.match.getByPlayerId(id);
  }
}

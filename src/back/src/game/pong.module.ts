import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { Match } from './models/match.entity';
import PongGateway from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [],
  providers: [PongGateway, PongService, MatchService]
})

export class PongModule {}

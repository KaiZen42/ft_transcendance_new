

import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import SnakeGateway from './snake.gateway';
import { GameService } from './snake.service';

@Module({
  providers: [GameGateway, SnakeGateway, GameService],
})
export class GameModule {}
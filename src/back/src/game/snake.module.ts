import { Module } from '@nestjs/common';
import SnakeGateway from './snake.gateway';
import { GameService } from './snake.service';

@Module({
  providers: [SnakeGateway, GameService],
})
export class SnakeModule {}

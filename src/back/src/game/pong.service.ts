import { Injectable } from '@nestjs/common';
import { GameState, Player, RoomState } from './interfaces/pong.interfaces';

const FIELD_WIDTH = 750;
const FIELD_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 125;
const BALL_RADIUS = 13;

@Injectable()
export class PongService {
  createGameState(inverted: boolean): GameState {
    return {
      players: [
        {
          x: 0,
          y: FIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
          width: PADDLE_WIDTH,
          height: inverted ? PADDLE_HEIGHT * 2 : PADDLE_HEIGHT,
          score: 0,
        },
        {
          x: FIELD_WIDTH - PADDLE_WIDTH,
          y: FIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
          width: PADDLE_WIDTH,
          height: inverted ? PADDLE_HEIGHT * 2 : PADDLE_HEIGHT,
          score: 0,
        },
      ],
      ball: {
        x: FIELD_WIDTH / 2,
        y: FIELD_HEIGHT / 2,
        radius: BALL_RADIUS,
        speed: 7,
        velocityX: 6,
        velocityY: 6,
        color: 0,
      },
      fieldWidth: FIELD_WIDTH,
      fieldHeight: FIELD_HEIGHT,
    };
  }

  // collision detection
  collision(ball: GameState['ball'], paddle: Player): boolean {
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    const ballLeft = ball.x - ball.radius;
    const ballRight = ball.x + ball.radius;

    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + paddle.width;

    return (
      ballRight > paddleLeft &&
      ballLeft < paddleRight &&
      ballBottom > paddleTop &&
      ballTop < paddleBottom
    );
  }

  // move the paddles
  updatePlayers(
    players: [Player, Player],
    moves: RoomState['moves'],
    fieldHeight: number,
  ) {
    if (moves[0].up)
      players[0].y = players[0].y - 5 >= 0 ? players[0].y - 5 : 0;
    if (moves[0].down)
      players[0].y =
        players[0].y + players[0].height + 5 < fieldHeight
          ? players[0].y + 5
          : fieldHeight - players[0].height;
    if (moves[1].up)
      players[1].y = players[1].y - 5 >= 1 ? players[1].y - 5 : 0;
    if (moves[1].down)
      players[1].y =
        players[1].y + players[1].height + 5 < fieldHeight
          ? players[1].y + 5
          : fieldHeight - players[1].height;
  }

  // reset ball
  resetBall(ball: GameState['ball']) {
    ball.x = FIELD_WIDTH / 2;
    ball.y = FIELD_HEIGHT / 2;
    ball.speed = 7;
    ball.velocityY = 7;
    ball.velocityX = ball.velocityX > 0 ? -6 : 6;
    ball.color = 0;
  }

  invertedLoop(state: GameState, ball: any) {
    const player = state.players[ball.x < state.fieldWidth / 2 ? 0 : 1];

    if (this.collision(ball, player)) {
      const madePoint = ball.x < state.fieldWidth / 2 ? 1 : 0;

      state.players[madePoint].score++;
      if (state.players[madePoint].score === 5) return 2;
      this.resetBall(ball);
    }

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > state.fieldWidth) {
      ball.color = ball.x < state.fieldWidth / 2 ? 1 : 2;
      let collidePoint = ball.y - state.fieldHeight / 2;
      collidePoint /= state.fieldHeight / 2;

      // calculate angle
      const angleRad = (collidePoint * Math.PI) / 4;

      // calculate direction
      const direction = ball.x < state.fieldWidth / 2 ? 1 : -1;

      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);

      // increase speed
      if (ball.speed < 17.5) ball.speed += 0.5;
    }
    return 0;
  }

  gameLoop(
    inverted: boolean,
    state: GameState,
    moves: RoomState['moves'],
  ): number {
    if (!state) return;

    const ball = state.ball;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if (ball.y + ball.radius > state.fieldHeight) {
      ball.y -= ball.radius;
      ball.velocityY *= -1;
    }
    if (ball.y - ball.radius < 0) {
      ball.y += ball.radius;
      ball.velocityY *= -1;
    }
    this.updatePlayers(state.players, moves, state.fieldHeight);

    if (inverted) return this.invertedLoop(state, ball);

    // determining which player is hitting the ball
    const player = state.players[ball.x < state.fieldWidth / 2 ? 0 : 1];

    if (this.collision(ball, player)) {
      ball.color = ball.x < state.fieldWidth / 2 ? 1 : 2;
      let collidePoint = ball.y - (player.y + player.height / 2);
      collidePoint /= player.height / 2;

      // calculate angle
      const angleRad = (collidePoint * Math.PI) / 4;

      // calculate direction
      const direction = ball.x < state.fieldWidth / 2 ? 1 : -1;

      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);

      // increase speed
      if (ball.speed < 17.5) ball.speed += 0.5;
    }

    const madePoint = ball.x < state.fieldWidth / 2 ? 1 : 0;
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > state.fieldWidth) {
      state.players[madePoint].score++;
      if (state.players[madePoint].score === 5) return 2;
      this.resetBall(ball);
    }
    return 0;
  }
}

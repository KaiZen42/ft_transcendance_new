import { Injectable } from "@nestjs/common"

const FIELD_WIDTH = 600
const FIELD_HEIGHT = 400

@Injectable()
export class PongService {
	createGameState() {
		return {
			players: [{
				x: 0,
				y: FIELD_HEIGHT/2 - 100/2,
				width: 10,
				height: 100,
				color: "WHITE",
				score: 0
			},
			{
				x: FIELD_WIDTH-10,
				y: FIELD_HEIGHT/2 - 100/2,
				width: 10,
				height: 100,
				color: "WHITE",
				score: 0
			}],
			ball: {
				x: FIELD_WIDTH/2,
				y: FIELD_HEIGHT/2,
				radius: 10,
				speed: 5,
				velocityX: 5,
				velocityY: 5,
				color: "white"
			},
			fieldWidth: FIELD_WIDTH,
			fieldHeight: FIELD_HEIGHT
		}
	}

	// collision detection
	collision(ball: any, paddle: any): boolean {
		const ballTop = ball.y - ball.radius
		const ballBottom = ball.y + ball.radius
		const ballLeft = ball.x - ball.radius
		const ballRight = ball.x + ball.radius

		const paddleTop = paddle.y
		const paddleBottom = paddle.y + paddle.height
		const paddleLeft = paddle.x
		const paddleRight = paddle.x + paddle.width

		return (ballRight > paddleLeft && ballLeft < paddleRight 
				&& ballBottom > paddleTop  && ballTop < paddleBottom)
	}

	// move the paddles
	updatePlayers(players: any, moves: any, fieldHeight: number) {
		if (moves[0].up)
			players[0].y = (players[0].y - 5 >= 0) ? players[0].y - 5 : 0
		if (moves[0].down)
			players[0].y = (players[0].y + players[0].height + 5 < fieldHeight) ? players[0].y + 5 : fieldHeight - players[0].height
		if (moves[1].up)
			players[1].y = (players[1].y - 5 >= 1) ? players[1].y - 5 : 0
		if (moves[1].down)
			players[1].y = (players[1].y + players[1].height + 5 < fieldHeight) ? players[1].y + 5 : fieldHeight - players[1].height
	}

	// reset ball
	resetBall(ball: any) {
		ball.x = FIELD_WIDTH/2
		ball.y = FIELD_HEIGHT/2
		ball.speed = 5
		ball.velocityX *= -1
	}
	
	gameLoop(state: any, moves: any): number {
		if (!state)
			return
		
		const ball = state.ball
		
		ball.x += ball.velocityX
		ball.y += ball.velocityY

		if (ball.y + ball.radius > state.fieldHeight || ball.y - ball.radius < 0)
			ball.velocityY *= -1
		
		this.updatePlayers(state.players, moves, state.fieldHeight)
		// determining which player is hitting the ball 
		const player = state.players[(ball.x < state.fieldWidth/2) ? 0 : 1]

		if (this.collision(ball, player)){
			let collidePoint = ball.y - (player.y + player.height/2)
			collidePoint /= (player.height/2)

			// calculate angle
			const angleRad = collidePoint * Math.PI/4

			// calculate direction
			const direction = (ball.x < state.fieldWidth/2) ? 1 : -1

			ball.velocityX = direction * ball.speed * Math.cos(angleRad)
			ball.velocityY =			 ball.speed * Math.sin(angleRad)

			// increase speed
			ball.speed += 0.1
		}

		if (ball.x - ball.radius < 0)
		{
			state.players[1].score++
			if (state.players[1].score === 5)
				return 2
			this.resetBall(ball)
		} else if (ball.x + ball.radius > state.fieldWidth) {
			state.players[0].score++
			if (state.players[0].score === 5)
				return 1
			this.resetBall(ball)
		}
		return 0		
	}
}
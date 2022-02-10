import { Injectable } from "@nestjs/common"


const GRID_SIZE = 20

@Injectable()
export class GameService {
	createGameState() {
		return {
			player: {
			  pos: {
				x: 3,
				y: 10
			  },
			  vel: {
				x: 1,
				y: 0
			  },
			  snake: [
				{x: 1, y:10},
				{x: 2, y: 10},
				{x: 3, y: 10}
			  ],
			},
			food: {
			  x: 7,
			  y: 7
			},
			gridSize: GRID_SIZE
		}
	}

	randomFood(state: any) {
		
		const food = {
			x: Math.floor(Math.random() * GRID_SIZE),
			y: Math.floor(Math.random() * GRID_SIZE)
		}

		for (let cell of state.player.snake)
		{
			if (cell.x === food.x && cell.y === food.y)
				return this.randomFood(state)
		}

		state.food = food;
	}

	gameLoop(state: any): number | boolean {
		if (!state)
			return
		
		const playerOne = state.player

		playerOne.pos.x += playerOne.vel.x
		playerOne.pos.y += playerOne.vel.y

		if (playerOne.pos.x < 0 || playerOne.pos.x >= GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y >= GRID_SIZE)
			return 2
		
		if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y)
		{
			playerOne.snake.push({ ...playerOne.pos })
			playerOne.pos.x += playerOne.vel.x
			playerOne.pos.y += playerOne.vel.y
			this.randomFood(state)
		}

		if (playerOne.vel.x || playerOne.vel.y)
		{
			for (let cell of playerOne.snake)
			{
				if (playerOne.pos.x === cell.x && playerOne.pos.y === cell.y)
					return 2
			}

			playerOne.snake.push({ ...playerOne.pos })
			playerOne.snake.shift()
		}
		return false		
	}

	getUpdatedVelocity(key: string)
	{
		switch (key)
		{
			case "ArrowUp": {
				return {x: 0, y: -1}
			}
			case "ArrowDown": {
				return {x: 0, y: 1}
			}
			case "ArrowRight": {
				return {x: 1, y: 0}
			}
			case "ArrowLeft": {
				return {x: -1, y: 0}
			}
		}
	}
}
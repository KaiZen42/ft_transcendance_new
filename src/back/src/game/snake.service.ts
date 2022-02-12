import { Injectable } from "@nestjs/common"


const GRID_SIZE = 20

@Injectable()
export class GameService {
	private createGameState() {
		return {
			players: [{
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
			}, {
				pos: {
					x: 18,
					y: 10
				},
				vel: {
					x: 1,
					y: 0
				},
				snake: [
					{x: 20, y:10},
					{x: 19, y: 10},
					{x: 18, y: 10}
				],
			}],
			food: {},
			gridSize: GRID_SIZE
		}
	}

	initgame() {
		const state = this.createGameState()
		this.randomFood(state)
		return state
	}

	randomFood(state: any) {
		
		const food = {
			x: Math.floor(Math.random() * GRID_SIZE),
			y: Math.floor(Math.random() * GRID_SIZE)
		}

		for (let cell of state.players[0].snake)
		{
			if (cell.x === food.x && cell.y === food.y)
				return this.randomFood(state)
		}
    for (let cell of state.players[1].snake)
		{
			if (cell.x === food.x && cell.y === food.y)
				return this.randomFood(state)
		}

		state.food = food;
	}

	gameLoop(state: any): number {
		if (!state)
			return
		
		const playerOne = state.players[0]
    	const playerTwo = state.players[1]

		playerOne.pos.x += playerOne.vel.x
		playerOne.pos.y += playerOne.vel.y

    	playerTwo.pos.x += playerTwo.vel.x
		playerTwo.pos.y += playerTwo.vel.y

		if (playerOne.pos.x < 0 || playerOne.pos.x >= GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y >= GRID_SIZE)
			return 2
    	if (playerTwo.pos.x < 0 || playerTwo.pos.x >= GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y >= GRID_SIZE)
			return 1
		
		if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y)
		{
			playerOne.snake.push({ ...playerOne.pos })
			playerOne.pos.x += playerOne.vel.x
			playerOne.pos.y += playerOne.vel.y
			this.randomFood(state)
		}
    	if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y)
		{
			playerTwo.snake.push({ ...playerTwo.pos })
			playerTwo.pos.x += playerTwo.vel.x
			playerTwo.pos.y += playerTwo.vel.y
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
    	if (playerTwo.vel.x || playerTwo.vel.y)
		{
			for (let cell of playerTwo.snake)
			{
				if (playerTwo.pos.x === cell.x && playerTwo.pos.y === cell.y)
					return 1
			}

			playerTwo.snake.push({ ...playerTwo.pos })
			playerTwo.snake.shift()
		}
		return 0		
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
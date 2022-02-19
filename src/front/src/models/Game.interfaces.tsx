
export const USER_COLOR = "rgb(201, 0, 241)"
export const OPPONENT_COLOR = "rgb(76, 123, 214)"

export interface Player {
	x: number;
	y: number;
	width: number;
	height: number;
	score: number;
  }
  
export interface Ball {
	x: number;
	y: number;
	radius: number;
	speed: number;
	velocityX: number;
	velocityY: number;
	color: number;
  }
  
export interface Net {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}

export interface GameState {
	players: [Player, Player];
	food: {
	  x: number;
	  y: number;
	};
	ball: Ball;
	fieldWidth: number;
	fieldHeight: number;
}

export interface User {
	id: string
	username: string,
	points: number,
	avatar: string,
	score: number
}
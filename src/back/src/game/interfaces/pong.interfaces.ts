export interface RoomStateMap {
  [roomId: string]: RoomState;
}

export interface RoomState {
  state: GameState;
  moves: [
    {
      up: boolean;
      down: boolean;
    },
    {
      up: boolean;
      down: boolean;
    },
  ];
  users: [UserInfo, UserInfo];
  intervalID: any;
  friendly: boolean;
  inverted: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  points: number;
  avatar: string;
}

export interface ClientRoom {
  [clientId: string]: string;
}

export interface GameState {
  players: [Player, Player];
  ball: {
    x: number;
    y: number;
    radius: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color: number;
  };
  fieldWidth: number;
  fieldHeight: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

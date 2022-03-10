export interface MatchUser {
  id: number;

  player1: {
    username: string;
    avatar: string;
  };

  player2: {
    username: string;
    avatar: string;
  };

  points1: number;

  points2: number;
}

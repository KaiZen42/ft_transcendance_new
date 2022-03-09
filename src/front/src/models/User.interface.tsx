export interface User {
  id: number;
  avatar: string;
  username: string;
  two_fa_auth: boolean;
  wins?: number;
  losses?: number;
  points?: number;
}

export interface DisplayUser {
  id: string;
  avatar: string;
  username: string;
  wins: number;
  losses: number;
  points: number;
}

// export class User {
  
//   constructor(
//         private id = 0, 
//         private username = '',
//         private avatar = '',) {  }
//         get getUsername(){ return this.username}
//         get getId(){return this.id}
//         get getAvatar(){return this.avatar}
// }

export interface User {
  id: number;
  avatar: string;
  username: string;
  two_fa_auth: boolean;
}

export interface DisplayUser {
  id: string;
  avatar: string;
  username: string;
  wins: number;
  losses: number;
  points: number;
}
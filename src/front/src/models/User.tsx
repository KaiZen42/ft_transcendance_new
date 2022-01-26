export class User {
  
  constructor(
        private id = 0, 
        private username = '',
        private avatar = '',) {  }
        get getUsername(){ return this.username}
        get getId(){return this.id}
        get getAvatar(){return this.avatar}
}
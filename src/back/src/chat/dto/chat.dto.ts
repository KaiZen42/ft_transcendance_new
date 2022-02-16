import {  IsNotEmpty } from "class-validator";

export class JoinRoomDto {
	
	@IsNotEmpty()
	idUser: number ;

	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	room: string;

	@IsNotEmpty()
	key: string;
  }

  export class creationDto {

	@IsNotEmpty()
	idUser: number;
  
	otherUser: number;
  
	pass : string;
  
	name : string;
  }
  
  export class openRoomDto {

	@IsNotEmpty()
	idUser: number;
	@IsNotEmpty()
	room : string;
}

export class messageDto {

	@IsNotEmpty()
	idUser: number;
	
	@IsNotEmpty()
	room : string;
  
	@IsNotEmpty()
	user: string;
	
	@IsNotEmpty()
	data: string;
  }
  
  export class ChannelInfo
{
	@IsNotEmpty()
	id: number;
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	isPrivate: boolean;
}

export class viewRoomDto {

	@IsNotEmpty()
	idUser: number;
  
	@IsNotEmpty()
	username: string;
	
	@IsNotEmpty()
	room : string;
  }
  
import {  IsNotEmpty } from "class-validator";

export interface OnlineMap {
	[id: number] : number
}

export class JoinRoomDto {
	@IsNotEmpty()
	idUser: number ;

	@IsNotEmpty()
	room: string;

	@IsNotEmpty()
	key: string;
  }

  export class creationDto {

	@IsNotEmpty()
	idUser: number;
  
	otherUser: number | undefined;
  
	pass : string;
  
	name : string;

	mode : string
  }
  
  export class openRoomDto {

	@IsNotEmpty()
	idUser: number;
	@IsNotEmpty()
	room : string;
}

export class messageDto {

	@IsNotEmpty()
	userId: {
		id : number;
		username : string;
	};
	
	@IsNotEmpty()
	room : string;

	@IsNotEmpty()
	data: string;
  }
  
  export class ChannelInfoDto
{
	@IsNotEmpty()
	id: number;
	@IsNotEmpty()
	name: string;
	@IsNotEmpty()
	isPrivate: boolean;

	@IsNotEmpty()
	partecipants: 
	{
		id: number,
		userId:{
			id: number,
			username: string,
			avatar: string
		}
	}[]

	@IsNotEmpty()
	mode: string


}

export class viewRoomDto {

	@IsNotEmpty()
	idUser: number;
	
	@IsNotEmpty()
	room : string;
  }

  export class updateChannelDto {
	  id: number;
	name: string;
	mode: string;
	pass: string;
  }
  
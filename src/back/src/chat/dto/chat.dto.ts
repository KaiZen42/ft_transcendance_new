import {  IsNotEmpty } from "class-validator";

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

}

export class viewRoomDto {

	@IsNotEmpty()
	idUser: number;
	
	@IsNotEmpty()
	room : string;
  }
  
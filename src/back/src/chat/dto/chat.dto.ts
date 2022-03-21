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

  export class LeaveRoomDto {
	@IsNotEmpty()
	idUser: number ;

	@IsNotEmpty()
	room: number;

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

  
export class channelRequestDto
{
	@IsNotEmpty()
  sender: number;
  @IsNotEmpty()
  reciver: number;
  @IsNotEmpty()
  channelId: number;
  @IsNotEmpty()
  type : string;
  
  time: number;
}

export class channelResponseDto
{

	@IsNotEmpty()
	reciver: number;
	@IsNotEmpty()
	reciverName: string;
	@IsNotEmpty()
	type : string;
	@IsNotEmpty()
	room : number;
}
  export class updateChannelDto {
	@IsNotEmpty()
	userId: number
	@IsNotEmpty()
	  id: number;
	  @IsNotEmpty()
	name: string;
	@IsNotEmpty()
	mode: string;
	pass: string | undefined;
  }


  
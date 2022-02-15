export interface Message {
	idUser: number;
	room: string;
	user: string;
	data: string;
  }

export interface PrivateInvite
{
	idUser: number;
	room : string;
}

export interface ChannelInfo
{
	id: number;
	name: string;
	isPrivate: boolean;
}

export interface CreationChannelPkg {
	idUser: number ;
	otherUser: number;
	pass: string;
	name: string;
  }

export interface JoinChannelPkg {
	idUser: number ;
	username: string
	key: string;
}

export interface OpenRoomPkg
{
	idUser: number;
	username: string;
	room : string;
	key: number;
}

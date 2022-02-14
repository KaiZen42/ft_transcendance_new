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
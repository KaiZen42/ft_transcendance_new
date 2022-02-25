/* export interface MessagePkg {
	idUser: number;
	room: string;
	user: string;
	data: string;
  } */

  export interface MessagePkg {
	id: number;
	data: string;
	userId: {
		id : number;
		username : string;
		};
	room: string;
	sendDate: Date;
	
  };

  export interface MessageInfoPkg {
	room: string;
	user: string;
	
  }

export interface OpenRoomPkg
{
	idUser: number;
	room : string;
}

export interface ChannelInfo
{
		id: number;
		name: string;
		isPrivate: boolean;
		partecipants: 
		{
			id: number,
			userId:{
				id: number,
				username: string,
				avatar: string
			}
		}[];
	notification: number ;
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

export interface ViewRoomPkg {

	idUser: number;
	username: string;
	room : string;
  }
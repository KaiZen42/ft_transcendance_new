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
    id: number;
    username: string;
  };
  room: string;
  sendDate: Date;
}

export interface MessageInfoPkg {
  room: string;
  user: string;
}

export interface OpenRoomPkg {
  idUser: number;
  room: string;
}

export interface ChannelInfo {
  id: number;
  name: string;
  isPrivate: boolean;
  partecipants: {
    id: number;
    userId: {
      id: number;
      username: string;
      avatar: string;
    };
  }[];
  mode: string;
  notification: number;
}

export interface ShortChannel {
  id: number;
  name: string;
  mode: string;
}

export interface CreationChannelPkg {
  idUser: number;
  otherUser: number | undefined;
  pass: string;
  name: string;
  mode: string;
}

export interface JoinChannelPkg {
  idUser: number;
  room: string;
  key: string;
}

export interface ViewRoomPkg {
  idUser: number;
  room: string;
}

export interface ChatInfo {
  userId: number | undefined;
  username: string;
  avatar: string;
  roomId: string;
  mode: string;
}

export interface Partecipant {
	muted: number;
	mod: string;
}

import { RestorePageOutlined } from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import {
  ChannelInfo,
  MessageInfoPkg,
  OpenRoomPkg,
} from '../../models/Chat.interface';
import { User } from '../../models/User.interface';

interface Prop {
  socket: Socket | undefined;
  userId: number;
  room: string;
  clicked: boolean;
  setClicked: Function;
}

export function ChannelList({ socket, userId, room, clicked, setClicked }: Prop) {
  const [channels, setChannel] = useState<ChannelInfo[]>([]);
  const [user, setUser] = useState<User[]>([]);
  //const [openRoomPkg, setOpenPkg] = useState();

  const selectChannel = (event: any, id: number) => {
    const viewRoom: OpenRoomPkg = {
      idUser: userId,
      room: '' + id,
    };
    socket?.emit('viewRoom', viewRoom);
    console.log('Clicked ', viewRoom);
  };

  async function getUser(chanId: number) {
    console.log('GETUSERS');
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/OtherUserInChannel/${chanId}/User/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) =>
        setUser((prevUser) => {
          return [...prevUser, result[0]];
        })
      );
  }

  useEffect(() => {
    socket?.on('notification', (msgInfo: MessageInfoPkg) => {
      if (room !== msgInfo.room) {
        let ch = channels.find((chan) => {
          return chan.name == msgInfo.room;
        });
        if (ch !== undefined) ch.notification++;
      }
    });

    return () => {
      socket?.removeListener('notification');
    };
  }, []);

  useEffect(() => {
	if (!clicked && channels.length) return;
    async function getter() {
      await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/channels/${userId}`,
        { credentials: 'include' }
      )
        .then((response) => response.json())
        .then((result) => {
			result.map((chan: ChannelInfo) => {
				const opnePkj: OpenRoomPkg = {
				idUser: userId,
				room: chan.id.toString(),
				};
				getUser(chan.id);
				socket?.emit('openRoom', opnePkj);
			});
         	setChannel(result);
        });
    }
    getter();

	setClicked(false);
	
    console.log('PRIMA:   ', clicked);
    // clicked = false;
    // console.log('DOPO:   ', clicked);
  }, [socket, clicked]);

  return (
    <div className="col-md-4 col-xl-3 chat">
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Open Chats</span>
          </div>
        </div>
        <div className="card-body contacts_body">
          {console.log('USERS FROM CHANNELS', user)}
          <ul className="contacts">
            {channels.map((chan: ChannelInfo, i) => {
              if (chan.notification === undefined) chan.notification = 0;
              return (
                <li className="active">
                  {/* TODO: aggiungere stato effettivo */}
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <img
                        src={user[i]?.avatar}
                        className="rounded-circle user_img"
                      />
                      <span className="online_icon"></span>
                    </div>
                    <div className="user_info">
                      <span>{user[i]?.username}</span>
                      <p>{chan?.name}</p>
                      {/* TODO: aggiungere stato effettivo */}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
}

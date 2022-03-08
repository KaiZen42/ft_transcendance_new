import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Sender } from './Sender';
import Wrapper from '../../components/Wrapper';
import MessageBox from './MessageBox';
import { User } from '../../models/User.interface';
import axios from 'axios';
import {
  MessageInfoPkg,
  MessagePkg,
  OpenRoomPkg,
  ViewRoomPkg,
} from '../../models/Chat.interface';
import { response } from 'express';
import { UserList } from './UserList';
import { Box, grid } from '@mui/system';
import { Grid } from '@mui/material';
import './testChat.css';
import { ChannelList } from './ChannelList';
import MessageHeader from './MessageHeader';
import { ChatInfo } from '../../models/Chat.interface';
import { JoinGroup } from './GroupComponent/JoinGroup';
const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

export function Chat(/* {user} : Prop */) {
  const [pkg, setPkg] = useState<MessagePkg>();
  const [socket, setSocket] = useState<Socket>();
  const [room, setRoom] = useState('');
  const [chatInfo, setChatInfo] = useState<ChatInfo>();
  const [openJoin, setOpenJoin] = useState(false);

  function getUser() {
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        setPkg({
          id: 0,
          data: '',
          userId: {
            id: result.id,
            username: result.username,
          },
          room: '',
          sendDate: new Date(),
        });
      });
  }

  useEffect(() => {
    if (pkg === undefined) getUser();
    const sock = io(WS_SERVER);
    setSocket(sock);

/*     sock.on('connect', () => {
      console.log('connected');
    }); */
    sock.on('viewedRoom', (roomView: string) => {
      setRoom(roomView);
      /* console.log('CURRENT ROOM: ', roomView); */
    });
    sock.on('createRoom', (newRoom: string) => {
    /*   console.log('Created a room:');
      console.log(newRoom);
      console.log(pkg); */
      setRoom(newRoom);
    });
    return () => {
      if (sock.connected) sock.close();
    };
  }, [pkg]);

  return (
    <Wrapper>
      <div className="container--fluid">
        <div className="row h-100">
          {pkg === undefined ? null : (
            <UserList socket={socket} userId={pkg.userId.id} />
          )}
          {pkg === undefined ? null : (
            <ChannelList
              socket={socket}
              userId={pkg.userId.id}
              room={room}
              setChatInfo={setChatInfo}
            />
          )}
          {chatInfo === undefined ? null : (
            <div className="col-md-4 col-xl-6 chat">
              <div>
                <div className="card">
                  <MessageHeader chatInfo={chatInfo} />
                  {pkg === undefined ? null : (
                    <MessageBox
                      socket={socket}
                      room={room}
                      userId={pkg.userId.id}
                    />
                  )}
                </div>
              </div>
              {pkg === undefined ? null : (
                <Sender socket={socket} room={room} packet={pkg} />
              )}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default Chat;

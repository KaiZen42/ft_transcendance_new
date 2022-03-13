import React, { useState, useEffect, useRef, useContext } from 'react';
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
import { context, Context } from '../../App';
const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

export function Chat(/* {user} : Prop */) {
  const cont: context = useContext(Context);
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
    if (socket === undefined && cont.socket !== undefined)
      setSocket(cont.socket);
    else if (socket !== undefined) {
      socket.on('viewedRoom', (roomView: string) => {
        setRoom(roomView);
        console.log('active room ;', room);
      });
      socket.on('createRoom', (newRoom: string) => {
        setRoom(newRoom);
        console.log('active room ;', room);
      });
    }
  }, [pkg, socket]);

  return cont.socket === undefined ? null : (
    <Wrapper>
      <div className="container-fluid">
        <div
          className="row h-50"
          style={{ marginLeft: '17%', marginRight: 'auto', width: '80%' }}
        >
          {pkg === undefined ? null : <UserList />}
          {pkg === undefined ? null : (
            <ChannelList room={room} setChatInfo={setChatInfo} />
          )}
		  {console.log("ECCOLOOO", chatInfo)}
          {chatInfo === undefined ? null : (
            <div className="col-md-4 col-xl-5 chat">
              <div>
                <div className="card">
                  <MessageHeader chatInfo={chatInfo} />
                  {pkg === undefined ? null : <MessageBox room={room} />}
                </div>
              </div>
              {pkg === undefined ? null : <Sender room={room} packet={pkg} />}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default Chat;

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
import { channel } from 'diagnostics_channel';
const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

export function Chat(/* {user} : Prop */) {
  const cont: context = useContext(Context);
  const [pkg, setPkg] = useState<MessagePkg>();
  const [socket, setSocket] = useState<Socket>();
  const [room, setRoom] = useState('');
  const [chatInfo, setChatInfo] = useState<ChatInfo>();
  const [openJoin, setOpenJoin] = useState(false);

  function getUser() {
    fetch(`/api/user`, {
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

  //-----------PKG OR SOCKET UPDATE
  useEffect(() => {
    if (pkg === undefined) getUser();
    if (socket === undefined && cont.socket !== undefined)
      setSocket(cont.socket);
  }, [pkg, socket, room]);

  //-----------VIEW LISTENER
  useEffect(() => {
    socket?.on('viewedRoom', (roomView: string) => {
      setRoom(roomView);
      console.log('active room ;', room);
      if (roomView === '' && chatInfo !== undefined) {
        const preInfo = chatInfo;
        preInfo.roomId = '';
        setChatInfo(undefined);
      }
    });

    return () => {
      socket?.removeListener('viewedRoom');
    };
  }, [pkg, socket, room, chatInfo]);

  useEffect(() => {
    if (socket !== undefined) {
      socket.on('createRoom', (newRoom: string) => {
        console.log('active room ;', room);
        setRoom(newRoom);
      });
    }
    return () => {
      socket?.removeListener('createRoom');
    };
  }, [socket]);

  return cont.socket === undefined ? null : (
    <Wrapper>
      <div id="parent" className="container-fluid">
        <div
          className="row h-50"
          style={{ marginLeft: '17%', marginRight: 'auto', width: '80%' }}
        >
          {pkg === undefined ? null : <UserList />}
          {pkg === undefined ? null : (
            <ChannelList room={room} setChatInfo={setChatInfo} />
          )}
          {chatInfo === undefined ||
          chatInfo.roomId === '' ||
          room === '' ? null : (
            <div className="col-md-4 col-xl-5 chat">
              <div>
                <div className="card">
                  {chatInfo === undefined ? null : (
                    <MessageHeader chatInfo={chatInfo} />
                  )}
                  {pkg === undefined || room === undefined ? null : (
                    <MessageBox room={room} />
                  )}
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

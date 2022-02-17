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
} from '../../models/Chat.interface';
import { response } from 'express';
import { UserList } from './UserList';
import { Box, grid } from '@mui/system';
import { Grid } from '@mui/material';
import './testChat.css';
import { ChannelList } from './ChannelList';
const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

/* export class inviteDto {

	@IsNotEmpty()
	userId: number;
	@IsNotEmpty()
	room : string;
} */

export function Chat(/* {user} : Prop */) {
  const [pkg, setPkg] = useState<MessagePkg>();
  const [socket, setSocket] = useState<Socket>();
  const [roomState, setRoom] = useState('');
  const [clicked, setClicked] = useState(false);

  function getUser() {
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        setPkg({
          data: '',
          userId: {
            id: result.id,
            username: result.username,
          },
          room: '',
          sendData: 0,
        });
      });
    console.log('ESPLOSOOOO');
    console.log(pkg);
  }

  useEffect(() => {
    if (pkg === undefined) getUser();
    const sock = io(WS_SERVER);
    setSocket(sock);
    sock.on('connect', () => {
      console.log('connected');
    });
    /* sock.on("createRoom", (room: PrivateInvite) => 
			{
				console.log('channel created:');
				console.log(room);
				setRoom(room.room);
			}); */
    sock.on('viewedRoom', (roomView: string) => {
      setRoom(roomView);
      console.log('CURRENT ROOM: ', roomView);
    });
    sock.on('createdPrivateRoom', (prvRoom: OpenRoomPkg) => {
      console.log('Recived Private invite:');
      console.log(prvRoom);
      console.log(pkg);
      setRoom(prvRoom.room);
      if (pkg !== undefined && pkg?.userId.id === prvRoom.idUser) {
        console.log('join in created room');
        sock.emit('openRoom', prvRoom);
      }
    });
    return () => {
      sock.close();
    };
  }, [pkg]);

  return (
    // socket === undefined ?  (<Wrapper> <div>Not Connected</div> </Wrapper>)
    // : (
    // 	<Wrapper>
    // 		<Box display="flex" flexDirection="row">
    // 			<Box width="100%">
    // 				{pkg === undefined ? (null) : <MessageBox socket={socket} room={roomState}/>}
    // 				{pkg === undefined ? (null) : <Sender socket={socket} packet={pkg} room={roomState}/>}
    // 			</Box>
    // 			<Box sx={{ minWidth : "fit-content" }}>
    // 				{pkg === undefined ? (null) : <UserList socket={socket} userId={pkg.userId.id}/>}
    // 			</Box>
    // 			<Box sx={{ minWidth : "fit-content" }}>
    // 				{pkg === undefined ? (null) : <ChannelList socket={socket} userId={pkg.userId.id} room={roomState}/>}
    // 			</Box>
    // 		</Box>
    // 	</Wrapper>
    // )

    <Wrapper>
      <div className="container--fluid">
        <div className="row h-100">
          {pkg === undefined ? null : (
            <UserList socket={socket} userId={pkg.userId.id} />
          )}
          {pkg === undefined ? (null) : <ChannelList socket={socket} userId={pkg.userId.id} room={roomState}/>}
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    <span className="online_icon"></span>
                  </div>
                  <div className="user_info">
                    <span>Chat with Khalid</span>
                    <p>1767 Messages</p>
                  </div>
                  <div className="video_cam">
                    <span>
                      <i className="fas fa-video"></i>
                    </span>
                    <span>
                      <i className="fas fa-phone"></i>
                    </span>
                  </div>
                </div>
                <span id="action_menu_btn">
                  <i className="fas fa-ellipsis-v"></i>
                </span>
                <div className="action_menu">
                  <ul>
                    <li>
                      <i className="fas fa-user-circle"></i> View profile
                    </li>
                    <li>
                      <i className="fas fa-users"></i> Add to close friends
                    </li>
                    <li>
                      <i className="fas fa-plus"></i> Add to group
                    </li>
                    <li>
                      <i className="fas fa-ban"></i> Block
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body msg_card_body">
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg"></div>
                  <div className="msg_cotainer">
                    Hi, how are you samim?
                    <span className="msg_time">8:40 AM, Today</span>
                  </div>
                </div>
                <div className="d-flex justify-content-end mb-4">
                  <div className="msg_cotainer_send">
                    Hi Khalid i am good tnx how about you?
                    <span className="msg_time_send">8:55 AM, Today</span>
                  </div>
                  <div className="img_cont_msg"></div>
                </div>
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg"></div>
                  <div className="msg_cotainer">
                    I am good too, thank you for your chat template
                    <span className="msg_time">9:00 AM, Today</span>
                  </div>
                </div>
                <div className="d-flex justify-content-end mb-4">
                  <div className="msg_cotainer_send">
                    You are welcome
                    <span className="msg_time_send">9:05 AM, Today</span>
                  </div>
                  <div className="img_cont_msg"></div>
                </div>
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg"></div>
                  <div className="msg_cotainer">
                    I am looking for your next templates
                    <span className="msg_time">9:07 AM, Today</span>
                  </div>
                </div>
                <div className="d-flex justify-content-end mb-4">
                  <div className="msg_cotainer_send">
                    Ok, thank you have a good day
                    <span className="msg_time_send">9:10 AM, Today</span>
                  </div>
                  <div className="img_cont_msg"></div>
                </div>
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg"></div>
                  <div className="msg_cotainer">
                    Bye, see you
                    <span className="msg_time">9:12 AM, Today</span>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn">
                      <i className="fas fa-paperclip"></i>
                    </span>
                  </div>
                  <textarea
                    name=""
                    className="form-control type_msg"
                    placeholder="Type your message..."
                  ></textarea>
                  <div className="input-group-append">
                    <span className="input-group-text send_btn">
                      <i className="fas fa-location-arrow"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Chat;

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

interface Prop {
  socket: Socket | undefined;
  userId: number;
  room: string;
}

export function ChannelList({ socket, userId, room }: Prop) {
  const [channels, setChannel] = useState<ChannelInfo[]>([]);
  //const [openRoomPkg, setOpenPkg] = useState();

  const selectChannel = (event: any, id: number) => {
    const viewRoom: OpenRoomPkg = {
      idUser: userId,
      room: '' + id,
    };
    socket?.emit('viewRoom', viewRoom);
    console.log('Clicked ', viewRoom);
  };

  useEffect(() => {
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/channles/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => setChannel(result));
    console.log('CHANNELS: ', channels);

    socket?.on('notification', (msgInfo: MessageInfoPkg) => {
      if (room !== msgInfo.room) {
        let ch = channels.find((chan) => {
          return chan.name == msgInfo.room;
        });
        if (ch !== undefined) ch.notification++;
      }
    });
  }, [socket]);
  // return(
  // 	<div>
  // 		<Box sx={{ p: 1, border: 1 }} >
  // 		<List dense sx={{ width: '100%',minWidth: 100, maxWidth: 200, bgcolor: 'background.paper' }}>
  // 			{channels.map( (chan: ChannelInfo) => {
  // 				//joinPkg : SimpleJoinPkg =  { idUser: userId; room: toString(chan.id)}
  // 				const opnePkj : OpenRoomPkg = { idUser: userId, room: chan.id.toString()};
  // 				if (chan.notification === undefined)
  // 					chan.notification = 0;
  // 				socket?.emit("openRoom", opnePkj);
  // 				return (
  // 				<ListItem key={chan.id} onClick={e => selectChannel(e, chan.id)}>
  // 				<ListItemButton>
  // 						<ListItemText id="outlined-basic" primary={`${chan.isPrivate? "P" : ""} ${chan.name}`} />
  // 				</ListItemButton>
  // 			</ListItem>
  // 			);})}
  // 		</List>
  // 		</Box>
  // 	</div>
  // );

//   default function get_avatar(Chan: ChannelInfo)
//   {
// 	  let 
// 	  return("")
//   }

  return (
    <div className="col-md-4 col-xl-3 chat">
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Your Chats</span>
          </div>
        </div>
        <div className="card-body contacts_body">
          <ul className="contacts">
            {channels.map((chan: ChannelInfo) => {
              //joinPkg : SimpleJoinPkg =  { idUser: userId; room: toString(chan.id)}
              const opnePkj: OpenRoomPkg = {
                idUser: userId,
                room: chan.id.toString(),
              };
              if (chan.notification === undefined) chan.notification = 0;
              socket?.emit('openRoom', opnePkj);
              return (
                <li className="active"> {/* TODO: aggiungere stato effettivo */}
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
					{/* 
					 */}
                      <span className="online_icon"></span>
                    </div>
                    <div className="user_info">
                      <span>Khalid</span>
                      <p>Kalid is online</p>
                    </div>
                  </div>
                </li>
              );
            })}
            {/* <li className="active">
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <span className="online_icon"></span>
                      </div>
                      <div className="user_info">
                        <span>Khalid</span>
                        <p>Kalid is online</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <span className="online_icon offline"></span>
                      </div>
                      <div className="user_info">
                        <span>Taherah Big</span>
                        <p>Taherah left 7 mins ago</p>
                      </div>
                    </div>
                  </li> */}
          </ul>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
}

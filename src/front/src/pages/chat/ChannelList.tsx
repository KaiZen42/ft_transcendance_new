import { RestorePageOutlined } from '@mui/icons-material';
import { Avatar, Stack } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import {
  ChannelInfo,
  MessageInfoPkg,
  OpenRoomPkg,
} from '../../models/Chat.interface';
import { User } from '../../models/User.interface';
import StyledBadge from '../../styles/StyleBage';

interface Prop {
  socket: Socket | undefined;
  userId: number;
  room: string;
}

export function ChannelList({ socket, userId, room }: Prop) {
  const [selected, setSelected] = useState(false);
  const [channels, setChannel] = useState<ChannelInfo[]>([]);
  //const [openRoomPkg, setOpenPkg] = useState();

  const selectChannel = (event: any, id: number) => {
    const viewRoom: OpenRoomPkg = {
      idUser: userId,
      room: '' + id,
    };
    socket?.emit('viewRoom', viewRoom);
    console.log('Clicked ', viewRoom);
	setSelected(true)
  };

  async function getRooms() {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/ChannelsInfo/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        result.map((chan: ChannelInfo) => {
          const opnePkj: OpenRoomPkg = {
            idUser: userId,
            room: chan.id.toString(),
          };
          socket?.emit('openRoom', opnePkj);
        });
        setChannel(result);
      });
  }

  async function getRoom(chanId: string) {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/ChannelsInfoId/${chanId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        const opnePkj: OpenRoomPkg = {
          idUser: userId,
          room: result.id.toString(),
        };
        socket?.emit('openRoom', opnePkj);
        console.log('join in created room', result);
        setChannel((prevChan) => {
          return [...prevChan, result];
        });
      });
  }

  useEffect(() => {
    if (channels.length == 0) getRooms();
    else if (
      room !== undefined &&
      room !== '' &&
      !channels.find((ch) => ch.id.toString() == room)
    ) {
      console.log('not FOUND CHID');
      getRoom(room);
    }
    socket?.on('notification', (msgInfo: MessageInfoPkg) => {
      if (room !== msgInfo.room) {
        let ch = channels.find((chan) => {
          return chan.name == msgInfo.room;
        });
        if (ch !== undefined) ch.notification++;
      }
    });
    socket?.on('createdPrivateRoom', (prvRoom: OpenRoomPkg) => {
      console.log('Recived Private invite:');
      console.log(prvRoom);

      // setRoom(prvRoom.room);
      if (
        userId === prvRoom.idUser &&
        !channels.find((ch) => ch.id.toString() == room)
      ) {
        console.log('PRIVATE');
        getRoom(prvRoom.room);
      }
    });
    return () => {
      socket?.removeListener('notification');
    };
  }, [socket, room]);

  function selectUser(info: ChannelInfo) {
    if (info.partecipants.length < 2) return null;
    {
      console.log('USERD ID CHLIST', info.partecipants);
    }
    return info.partecipants[0].userId.id === userId
      ? info.partecipants[1].userId
      : info.partecipants[0].userId;
  }

  return (
    <div className="col-md-3 col-xl-2 chat">
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Open Chats</span>
          </div>
        </div>
        <div className="card-body contacts_body">
          <ul className="contacts">
            {console.log('rooms: ', channels)}

            {channels.map((chan: ChannelInfo) => {
              if (chan.notification === undefined) chan.notification = 0;
              return (
                <li className={selected ? "active" : ""} key={chan.id}>
                 
                  {/* TODO: aggiungere stato effettivo */}
                  <div
                    className="d-flex bd-highlight"
                    onClick={(e) => selectChannel(e, chan.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {chan.isPrivate ? (
                      <div className="img_cont">
                        <div className="img_cont">
                          <Stack direction="row" spacing={2}>
                            <StyledBadge
                              overlap="circular"
                              invisible={selected}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                              variant="dot"
                            >
                              <Avatar
                                alt="Img"
                                src={selectUser(chan)?.avatar}
                              />
                            </StyledBadge>
                          </Stack>
                        </div>
                      </div>
                    ) : null}
                    <div className="user_info">
                      <span>
                        {chan.isPrivate
                          ? selectUser(chan)?.username
                          : chan?.name}
                      </span>
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

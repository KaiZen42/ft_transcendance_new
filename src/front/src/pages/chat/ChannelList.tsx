import { RestorePageOutlined } from '@mui/icons-material';
import { Avatar, Stack } from '@mui/material';
import { channel } from 'diagnostics_channel';
import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import {
  ChannelInfo,
  MessageInfoPkg,
  OpenRoomPkg,
} from '../../models/Chat.interface';
import { User } from '../../models/User.interface';
import StyledBadge from '../../styles/StyleBage';
import InfoChat from './Chat';

interface Prop {
  socket: Socket | undefined;
  userId: number;
  room: string;
  setChatInfo: Function;
}

export function ChannelList({ socket, userId, room, setChatInfo }: Prop) {
  const [selected, setSelected] = useState(false);
  const [activeID, setActiveID] = useState(0);
  const [channels, setChannel] = useState<ChannelInfo[]>([]);
  const [click, setClick] = useState(false);
  //const [openRoomPkg, setOpenPkg] = useState();

  const selectChannel = (event: any, id: number, chan: ChannelInfo) => {
    const viewRoom: OpenRoomPkg = {
      idUser: userId,
      room: '' + id,
    };
    socket?.emit('viewRoom', viewRoom);
    console.log('Clicked ', viewRoom);
    setSelected(true);
    console.log('ID', id);
    setActiveID(id);

    if (chan.isPrivate) {
      setChatInfo({
        username: selectUser(chan)?.username,
        avatar: selectUser(chan)?.avatar,
        roomId: chan?.id,
      });
    } else {
      setChatInfo({
        username: chan?.name,
        avatar: undefined,
        roomId: chan?.id,
      });
    }
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
        if (result.isPrivate) {
          setChatInfo({
            username: selectUser(result)?.username,
            avatar: selectUser(result)?.avatar,
            roomId: room,
          });
        } else {
          setChatInfo({
            username: result?.name,
            avatar: undefined,
            roomId: room,
          });
        }
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
    return info.partecipants[0].userId.id === userId
      ? info.partecipants[1].userId
      : info.partecipants[0].userId;
  }

  useEffect(() => {
    console.log('CLICCATO:  ', click);
  }, [click]);

  return (
    <div className="col-md-3 col-xl-2 chat" onClick={e => click? setClick(false): null}>
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Open Chats</span>
            <span id="action_menu_btn" onClick={(e) => setClick(!click)}>
              <i className="fas fa-ellipsis-v"></i>
            </span>
            {click === true ? (
              <div className="action_menu">
                <ul>
                  <li>
                    <i className="fas fa-user-circle"></i> View profile
                  </li>
                  <li>
                    <i className="fas fa-users"></i> Add to close friends
                  </li>
                  <li>
                    <i className="fas fa-plus"></i> Create Group
                  </li>
                  <li>
                    <i className="fas fa-ban"></i> Block
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className="card-body contacts_body">
          <ul className="contacts">
            {console.log('rooms: ', new Set(channels))}
            {channels.map((chan: ChannelInfo, i) => {
              if (channels.findIndex((ch) => ch.id == chan.id) !== i) return;
              if (chan.notification === undefined) chan.notification = 0;
              return (
                <li
                  className={selected && activeID === chan.id ? 'active' : ''}
                  key={chan.id}
                  style={{ border: '1px solid white', borderRadius: '10px' }}
                >
                  {/* TODO: aggiungere stato effettivo */}
                  <div
                    className="d-flex"
                    onClick={(e) => selectChannel(e, chan.id, chan)}
                    style={{ cursor: 'pointer' }}
                  >
                    {chan.isPrivate ? (
                      <div className="img_cont">
                        <div className="img_cont">
                          <Stack direction="row" spacing={2}>
                            <StyledBadge
                              overlap="circular"
                              invisible={false}
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

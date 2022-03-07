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
import { CreateGroup } from './CreateGroup';
import { JoinGroup } from './JoinGroup';

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
  const [visibleJoin, setVisibleJoin] = useState('hidden');
  const [visibleCreate, setVisibleCreate] = useState('hidden');

  //const [openRoomPkg, setOpenPkg] = useState();

  function chatInfo(current: ChannelInfo | undefined)
  {
    if (current?.isPrivate) {
      setChatInfo({
        username: selectUser(current)?.username,
        avatar: selectUser(current)?.avatar,
        roomId: room,
      });
    } else {
      setChatInfo({
        username: current?.name,
        avatar: undefined,
        roomId: room,
      });
    }
  }

  const selectChannel = (event: any, id: number, chan: ChannelInfo) => {
    const viewRoom: OpenRoomPkg = {
      idUser: userId,
      room: '' + id,
    };
    socket?.emit('viewRoom', viewRoom);
    setSelected(true);
    setActiveID(id);
    chatInfo(chan);
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
        setChannel((prevChan) => {
          return [...prevChan, result];
        });
        chatInfo(result)
      });
  }

  useEffect(() => {
    //---------CONDITION 1 FIRST RENDER----------
    if (channels.length == 0) getRooms();
    //---------CONDITION 2 ADD NEW ROOM----------
    else if (
      room !== undefined &&
      room !== '' &&
      !channels.find((ch) => ch.id.toString() == room)
    ) {
      getRoom(room);
    }
    //---------CONDITION 3 LOAD EXIST ROOM----------
    else if (room !== undefined && room !== '') 
        chatInfo(channels.find((ch) => ch.id.toString() == room))
    socket?.on('notification', (msgInfo: MessageInfoPkg) => {
      if (room !== msgInfo.room) {
        let ch = channels.find((chan) => {
          return chan.name == msgInfo.room;
        });
        if (ch !== undefined) ch.notification++;
      }
    });
    socket?.on('createdPrivateRoom', (prvRoom: OpenRoomPkg) => {

      // setRoom(prvRoom.room);
      if (
        userId === prvRoom.idUser &&
        !channels.find((ch) => ch.id.toString() == room)
      ) {
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
  }, [click]);

  return (
    <div
      className="col-md-3 col-xl-2 chat"
      onClick={(e) => (click ? setClick(false) : null)}
    >
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Open Chats</span>
            <span id="action_menu_btn" style={{zIndex: 0}} onClick={(e) => setClick(!click)}>
              <i className="fas fa-ellipsis-v"></i>
            </span>
            {click === true ? (
              <div className="action_menu" style={{zIndex: 1}}>
                <ul>
                  <li onClick={(e) => setVisibleJoin('visible')}>
                    <i className="fas fa-users"></i> Join Group
                  </li>
                  <li onClick={(e) => setVisibleCreate('visible')}>
                    <i className="fas fa-plus"></i> Create Group
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className="card-body contacts_body">
          <ul className="contacts">
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
                            style={{zIndex: 0}}
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
      <JoinGroup
        socket={socket}
        userId={userId}
        isVisible={visibleJoin}
        setVisibility={setVisibleJoin}
      />
      <CreateGroup
        socket={socket}
        userId={userId}
        isVisible={visibleCreate}
        setVisibility={setVisibleCreate}
      />
    </div>
  );
}

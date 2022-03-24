import { Avatar, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../../App';
import {
  ChannelInfo,
  channelResponsePkj,
  MessageInfoPkg,
  OpenRoomPkg,
  ShortChannel,
} from '../../models/Chat.interface';
import StyledBadge from '../../styles/StyleBage';
import { CreateGroup } from './CreateGroup';
import { JoinGroup } from './JoinGroup';

interface Prop {
  room: string;
  setChatInfo: Function;
}

export function ChannelList({ room, setChatInfo }: Prop) {
  const onlines = useContext(Context).online;
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const [selected, setSelected] = useState(false);
  const [activeID, setActiveID] = useState(0);
  const [channels, setChannel] = useState<ChannelInfo[]>([]);
  const [click, setClick] = useState(false);
  const [visibleJoin, setVisibleJoin] = useState('hidden');
  const [visibleCreate, setVisibleCreate] = useState('hidden');

  function chatInfo(current: ChannelInfo | undefined) {
    if (!current) return;
    if (current.isPrivate) {
      setChatInfo({
        userId: selectUser(current)?.id,
        username: selectUser(current)?.username,
        avatar: selectUser(current)?.avatar,
        roomId: room,
        mode: 'PRI',
      });
    } else {
      setChatInfo({
        userId: undefined,
        username: current?.name,
        avatar: undefined,
        roomId: room,
        mode: current?.mode,
      });
    }
  }

  const selectChannel = (id: number, chan: ChannelInfo) => {
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
    await fetch(`/api/chat/ChannelsInfo/${userId}`, { credentials: 'include' })
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
    await fetch(`/api/chat/ChannelsInfoId/${chanId}`, {
      credentials: 'include',
    })
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
        chatInfo(result);
      });
  }

  useEffect(() => {
    //---------CONDITION 2 ADD NEW ROOM----------
    if (
      room !== undefined &&
      room !== '' &&
      !channels.find((ch) => ch.id.toString() === room)
    ) {
      getRoom(room);
    }
    //---------CONDITION 3 LOAD EXIST ROOM----------
    else if (room !== undefined && room !== '') {
      chatInfo(channels.find((ch) => ch.id.toString() === room));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, room]);

  //----------------------remove ROOM
  useEffect(() => {
    socket?.on('QuitRoom', (roomId: number) => {
      const idx = channels.findIndex((ch) => ch.id === roomId);
      if (idx !== -1) {
        setChannel((pred) => {
          pred.splice(idx, 1);
          return [...pred];
        });
      }
      if (room === roomId.toString())
        socket.emit('viewRoom', { idUser: userId, room: '' });
    });
    socket?.on('ChangedRoomSettings', (shortCh: ShortChannel) => {
      const idx = channels.findIndex((ch) => ch.id === shortCh.id);
      const ch = channels[idx];

      ch.name = shortCh.name;
      ch.mode = shortCh.mode;

      if (idx !== -1) {
        setChannel((pred) => {
          pred[idx] = ch;
          return [...pred];
        });
        chatInfo(ch);
      }
    });
    return () => {
      socket?.removeListener('QuitRoom');
      socket?.removeListener('ChangedRoomSettings');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channels]);

  useEffect(() => {
    //---------CONDITION 1 FIRST RENDER----------
    if (channels.length === 0) getRooms();

    //---------SOCKET ON-------------

    socket?.on('notification', (msgInfo: MessageInfoPkg) => {
      if (room !== msgInfo.room) {
        let ch = channels.find((chan) => {
          return chan.name === msgInfo.room;
        });
        if (ch !== undefined) ch.notification++;
      }
    });
    socket?.on('createdPrivateRoom', (prvRoom: OpenRoomPkg) => {
      // setRoom(prvRoom.room);
      if (
        userId === prvRoom.idUser &&
        !channels.find((ch) => ch.id.toString() === room)
      ) {
        getRoom(prvRoom.room);
      }
    });

    socket?.on('deleted', (res: number) => {
      socket.emit('leaveRoom', res);
    });

    socket?.on('memberUpdate', (res: channelResponsePkj) => {
      if (
        res.reciver === userId &&
        (res.type === 'ban' || res.type === 'kick')
      ) {
        socket.emit('leaveRoom', res.room);
      }
    });

    return () => {
      socket?.removeListener('notification');
      socket?.removeListener('createdPrivateRoom');
      socket?.removeListener('memberUpdate');
      socket?.removeListener('deleted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectUser(info: ChannelInfo) {
    return info.partecipants[0].userId.id === userId
      ? info.partecipants[1].userId
      : info.partecipants[0].userId;
  }

  function clicker(e: any) {
    if (document.getElementById('prova1') === e.target) {
      setClick(!click);
    } else if (click) {
      setClick(false);
    }
  }

  useEffect(() => {
    document.getElementById('parent')?.addEventListener('click', clicker);
    return () => {
      document.getElementById('parent')?.removeEventListener('click', clicker);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [click]);

  return (
    <div className="col-md-2 col-xl-2 chat flexibility">
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Open Chats</span>
            <span
              id="action_menu_btn"
              style={{ zIndex: 0 }}
              /* onClick={(e) => setClick(!click)} */
            >
              <i id="prova1" className="fas fa-ellipsis-v"></i>
            </span>
            {click === true ? (
              <div className="action_menu" style={{ zIndex: 1 }}>
                <ul>
                  <li onClickCapture={(e) => setVisibleJoin('visible')}>
                    <i className="fas fa-users"></i> Join Group
                  </li>
                  <li onClickCapture={(e) => setVisibleCreate('visible')}>
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
              if (channels.findIndex((ch) => ch.id === chan.id) !== i)
                return <></>;
              if (chan.notification === undefined) chan.notification = 0;
              const on = chan.isPrivate
                ? onlines.find(
                    (el) =>
                      selectUser(chan).id === el || selectUser(chan).id === -el
                  )
                : undefined;
              return (
                <li
                  className={selected && activeID === chan.id ? 'active' : ''}
                  key={chan.id}
                  style={{ border: '1px solid white', borderRadius: '10px' }}
                >
                  <div
                    className="d-flex"
                    onClick={() => {
                      selectChannel(chan.id, chan);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {chan.isPrivate ? (
                      <div className="img_cont">
                        <div className="img_cont">
                          <Stack direction="row" spacing={2}>
                            <StyledBadge
                              color={
                                on !== undefined
                                  ? on > 0
                                    ? 'success'
                                    : 'warning'
                                  : 'error'
                              }
                              style={{ zIndex: 0 }}
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
                                style={{ wordWrap: 'break-word' }}
                              />
                            </StyledBadge>
                          </Stack>
                        </div>
                      </div>
                    ) : null}
                    <div
                      className="user_info"
                      style={{ wordWrap: 'break-word' }}
                    >
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
      {visibleJoin === 'hidden' ? null : (
        <JoinGroup isVisible={visibleJoin} setVisibility={setVisibleJoin} />
      )}
      {visibleCreate === 'hidden' ? null : (
        <CreateGroup
          isVisible={visibleCreate}
          setVisibility={setVisibleCreate}
        />
      )}
    </div>
  );
}

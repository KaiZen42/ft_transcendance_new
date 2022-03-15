import { Avatar, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../../App';
import {
  ChannelInfo,
  MessageInfoPkg,
  OpenRoomPkg,
} from '../../models/Chat.interface';
import StyledBadge from '../../styles/StyleBage';
import { CreateGroup } from './GroupComponent/CreateGroup';
import { JoinGroup } from './GroupComponent/JoinGroup';

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

  //const [openRoomPkg, setOpenPkg] = useState();

  function chatInfo(current: ChannelInfo | undefined) {
    if (current?.isPrivate) {
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
        chatInfo(result);
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
      chatInfo(channels.find((ch) => ch.id.toString() == room));
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

    //remove ROOM
    socket?.on('QuitRoom', (roomId: number) => {
      const idx = channels.findIndex((ch) => ch.id === roomId);
      if (idx !== -1) {
        setChannel((pred) => {
          pred.splice(idx, 1);
          return [...pred];
        });
      }
    });

    return () => {
      socket?.removeListener('notification');
    };
  }, [socket, room]);

  function selectUser(info: ChannelInfo) {
    return info.partecipants[0].userId.id === userId
      ? info.partecipants[1].userId
      : info.partecipants[0].userId;
  }

  useEffect(() => {
    document.getElementById('parent')?.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) setClick(false);
      else setClick(true);
      console.log(e.target, e.currentTarget);
    });
  }, [click]);

  return (
    <div className="col-md-2 col-xl-2 chat">
      <div className="card mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="user_info">
            <span>Open Chats</span>
            <span
              id="action_menu_btn"
              style={{ zIndex: 0 }}
              onClick={(e) => setClick(!click)}
            >
              <i className="fas fa-ellipsis-v"></i>
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
              if (channels.findIndex((ch) => ch.id == chan.id) !== i) return;
              if (chan.notification === undefined) chan.notification = 0;
              const on = chan.isPrivate
                ? onlines.find(
                    (el) =>
                      selectUser(chan).id === el || selectUser(chan).id === -el
                  )
                : undefined;
              //console.log("is on" ,  selectUser(chan).id , " ? " + on, onlines )
              return (
                <li
                  className={selected && activeID === chan.id ? 'active' : ''}
                  key={chan.id}
                  style={{ border: '1px solid white', borderRadius: '10px' }}
                >
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

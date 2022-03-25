import { Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Context } from '../../App';
import {
  channelRequestPkj,
  ChatInfo,
  OpenRoomPkg,
  Partecipant,
} from '../../models/Chat.interface';
import StyledBadge from '../../styles/StyleBage';
import GroupInfo from './GroupInfo';
import GroupSettings from './GroupSettings';
import groupIcon from '../../assets/group_icon.jpeg';

interface Prop {
  chatInfo: ChatInfo | undefined;
}

export default function MessageHeader({ chatInfo }: Prop) {
  const onlines = useContext(Context).online;
  const socket = useContext(Context).socket;
  const userId = useContext(Context).userId;
  const [on, setOn] = useState<number>();
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [click, setClick] = useState(false);
  const [partecipantInfo, setPartecipantInfo] = useState<Partecipant>();
  const [otherPartecipant, setOtherPartecipant] = useState<Partecipant>();

  async function getPartecipantInfo() {
    await fetch(
      `/api/chat/GetPartecipantByUserAndChan/${chatInfo?.roomId}/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        setPartecipantInfo(result);
      })
      .catch(() => {});
    if (chatInfo?.userId !== undefined) {
      await fetch(
        `/api/chat/GetPartecipantByUserAndChan/${chatInfo?.roomId}/${chatInfo?.userId}`,
        { credentials: 'include' }
      )
        .then((response) => response.json())
        .then((result) => {
          setOtherPartecipant(result);
        })
        .catch(() => {});
    }
  }

  function blockUser() {
    if (
      chatInfo !== undefined &&
      chatInfo.userId !== undefined &&
      otherPartecipant !== undefined
    ) {
      const req: channelRequestPkj = {
        sender: userId,
        reciver: chatInfo.userId,
        channelId: +chatInfo.roomId,
        type: otherPartecipant.mod === 'm' ? 'Block' : 'Unblock',
        reciverName: chatInfo.username,
        time: 0,
      };
      socket?.emit('BlockUser', req);
      const ot = otherPartecipant;
      ot.mod = req.type === 'Block' ? 'b' : 'm';
      setOtherPartecipant(ot);
    }
  }

  function userLeave() {
    const leavePkg: OpenRoomPkg = {
      idUser: userId,
      room: chatInfo!.roomId,
    };
    socket?.emit('leaveRoom', leavePkg);
  }

  useEffect(() => {
    if (chatInfo?.userId !== undefined) {
      setOn(
        onlines.find((el) => chatInfo.userId === el || chatInfo.userId === -el)
      );
    }
    //--------click event listener---------
    document.getElementById('parent')?.addEventListener('click', clicker);
    return () => {
      document.getElementById('parent')?.removeEventListener('click', clicker);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInfo, useContext(Context), otherPartecipant, click]);

  function clicker(e: any) {
    if (document.getElementById('prova') === e.target) {
      setClick(!click);
    } else if (click) {
      setClick(false);
    }
  }

  useEffect(() => {
    getPartecipantInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInfo]);

  const navigate = useNavigate();

  return (
    <div className="card-header msg_head">
      <div className="d-flex bd-highlight">
        <div className="img_cont">
          <NavLink
            to={
              chatInfo?.avatar === undefined
                ? ''
                : '/users/' + chatInfo?.username
            }
          >
            <StyledBadge
              overlap="circular"
              color={
                on !== undefined ? (on > 0 ? 'success' : 'warning') : 'error'
              }
              invisible={chatInfo?.avatar === undefined}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <Avatar
                alt="Img"
                src={
                  chatInfo?.avatar === undefined ? groupIcon : chatInfo?.avatar
                }
              />
            </StyledBadge>
          </NavLink>
        </div>
        <div className="user_info">
          <span>{chatInfo?.username}</span>
          <span id="action_menu_btn" style={{ zIndex: 0 }}>
            <i id="prova" className="fas fa-ellipsis-v"></i>
          </span>
          {chatInfo?.avatar === undefined && click === true ? (
            <div className="action_menu" style={{ zIndex: 1 }}>
              <ul>
                <li onClickCapture={(e) => setInfoVisibility(true)}>
                  <i className="fas fa-info"></i> Group Info
                </li>
                <li onClickCapture={(e) => userLeave()}>
                  <i className="fas fa-sign-out-alt"></i> Leave group
                </li>
                {partecipantInfo?.mod === 'o' ||
                partecipantInfo?.mod === 'a' ? (
                  <li onClickCapture={(e) => setSettingsVisibility(true)}>
                    <i className="fas fa-cog"></i> Settings
                  </li>
                ) : null}
              </ul>
            </div>
          ) : click === true ? (
            <div className="action_menu" style={{ zIndex: 1 }}>
              <ul>
                <li
                  onClickCapture={() =>
                    navigate('/users/' + chatInfo?.username)
                  }
                >
                  <i className="fas fa-user"></i> User Profile
                </li>
                <li onClickCapture={(e) => blockUser()}>
                  <i className="fas fa-ban"></i>{' '}
                  {otherPartecipant !== undefined &&
                  otherPartecipant.mod !== 'b'
                    ? 'Block'
                    : 'Unblock'}
                </li>
              </ul>
            </div>
          ) : null}
          <p>{chatInfo?.avatar === undefined ? 'Gente' : null}</p>
        </div>
      </div>
      {infoVisibility === false ||
      chatInfo === undefined ||
      chatInfo.roomId === '' ? null : (
        <GroupInfo
          isVisible={infoVisibility}
          setVisibility={setInfoVisibility}
          chatInfo={chatInfo}
        />
      )}
      {settingsVisibility === false &&
      partecipantInfo?.mod !== 'o' &&
      partecipantInfo?.mod !== 'a' ? null : chatInfo === undefined ||
        chatInfo.roomId === '' ? null : (
        <GroupSettings
          isVisible={settingsVisibility}
          setVisibility={setSettingsVisibility}
          chatInfo={chatInfo}
        />
      )}
    </div>
  );
}

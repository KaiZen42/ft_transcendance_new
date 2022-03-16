import { Block, RestorePageOutlined, Room } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../App';
import {
  channelRequestPkj,
  ChatInfo,
  Partecipant,
} from '../../models/Chat.interface';
import StyledBadge from '../../styles/StyleBage';
import GroupInfo from './GroupComponent/GroupInfo';
import GroupSettings from './GroupComponent/GroupSettings';

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
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/GetPartecipantByUserAndChan/${chatInfo?.roomId}/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        setPartecipantInfo(result);
      });

    //console.log("other ", chatInfo, otherPartecipant)
    if (chatInfo?.userId !== undefined) {
      await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/GetPartecipantByUserAndChan/${chatInfo?.roomId}/${chatInfo?.userId}`,
        { credentials: 'include' }
      )
        .then((response) => response.json())
        .then((result) => {
          setOtherPartecipant(result);
        });
    }
  }

  function blockUser() {
    console.log('BLOCK/UNBLOCK ', chatInfo, otherPartecipant);
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
      };
      socket?.emit('BlockUser', req);
      const ot = otherPartecipant;
      ot.mod = req.type === 'Block' ? 'b' : 'm';
      setOtherPartecipant(ot);
    }
  }

  useEffect(() => {
    if (chatInfo?.userId !== undefined) {
      setOn(
        onlines.find((el) => chatInfo.userId === el || chatInfo.userId === -el)
      );
    }
    console.log('RENDER HEADER: ', on, chatInfo, onlines);

    document.getElementById('parent')?.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) setClick(false);
      else return;
    });
    getPartecipantInfo();
  }, [chatInfo, useContext(Context), otherPartecipant]);

  useEffect(() => {
  }, []);

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
                  chatInfo?.avatar === undefined
                    ? './group_icon.png'
                    : chatInfo?.avatar
                }
              />
            </StyledBadge>
          </NavLink>
        </div>
        <div className="user_info">
          <span>{chatInfo?.username}</span>
          <span
            id="action_menu_btn"
            style={{ zIndex: 0 }}
            onClick={(e) => setClick(!click)}
          >
            <i className="fas fa-ellipsis-v"></i>
          </span>
          {chatInfo?.avatar === undefined && click === true ? (
            <div className="action_menu" style={{ zIndex: 1 }}>
              <ul>
                <li onClickCapture={(e) => setInfoVisibility(true)}>
                  <i className="fas fa-info"></i> Group Info
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
                <NavLink
                  to={
                    chatInfo?.avatar === undefined
                      ? ''
                      : '/users/' + chatInfo?.username
                  }
                >
                  <li>
                    <i className="fas fa-user"></i> User Profile
                  </li>
                </NavLink>
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
      {/*TODO: ROUTE TO PROFILE*/}
      {/*  visibleJoin ? null : <JoinGroup
        isVisible={visibleJoin}
        setVisibility={setVisibleJoin} 
      /> */}
      {/* <span id="action_menu_btn">
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
						</div> */}
    </div>
  );
}

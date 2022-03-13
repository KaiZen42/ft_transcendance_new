import { RestorePageOutlined, Room } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../App';
import { ChatInfo } from '../../models/Chat.interface';
import StyledBadge from '../../styles/StyleBage';
import GroupInfo from './GroupComponent/GroupInfo';

interface Prop {
  chatInfo: ChatInfo | undefined;
}

export default function MessageHeader({ chatInfo }: Prop) {
  const onlines = useContext(Context).online;
  const [on, setOn] = useState<number>();
  const [infoVisibility, setInfoVisibility] = useState(false);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (chatInfo?.userId !== undefined) {
      console.log('TESST');
      setOn(
        onlines.find((el) => chatInfo.userId === el || chatInfo.userId === -el)
      );
    }
    console.log('RENDER HEADER: ', on, chatInfo, onlines);
  }, [chatInfo, useContext(Context)]);

  return (
    <div className="card-header msg_head">
      <div className="d-flex bd-highlight">
        <div className="img_cont">
		
        <NavLink to={chatInfo?.avatar === undefined ? '' :
'/users/' + chatInfo?.username}>
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
          {chatInfo?.avatar === undefined ? <span
            id="action_menu_btn"
            style={{ zIndex: 0 }}
            onClick={(e) => setClick(!click)}
          >
            <i className="fas fa-ellipsis-v"></i>
          </span> : null}
          {click === true ? (
            <div className="action_menu" style={{ zIndex: 1 }}>
                <ul>
                  <li onClick={e => setInfoVisibility(true)}>
                    <i className="fas fa-info"></i> Group Info
                  </li>
                  <li>
                    <i className="fas fa-cog"></i> Settings
                  </li>
                </ul>
            </div>
          ) : null}
          <p>{chatInfo?.avatar === undefined ? 'Gente' : null}</p>
        </div>
      </div>
      {infoVisibility === false ? null : (<GroupInfo isVisible={infoVisibility} setVisibility={setInfoVisibility} chatInfo={chatInfo}/>)}
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

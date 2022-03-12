import { Avatar, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import {
  ChatInfo,
  JoinChannelPkg,
  ShortChannel,
} from '../../../models/Chat.interface';
import CheckPass from './CheckPass';
import { Context } from '../../../App';
import { User } from '../../../models/User.interface';
import { PropaneSharp } from '@mui/icons-material';
import StyledBadge from '../../../styles/StyleBage';

interface Prop {
  isVisible: boolean;
  setVisibility: Function;
  chatInfo: ChatInfo | undefined;
}

export default function GroupInfo(Prop: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const onlines = useContext(Context).online;

  const [partecipants, setPartecipants] = useState<User[]>([]);

  async function getUsersInChan() {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/UserInChannel/${Prop.chatInfo?.roomId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => setPartecipants(result));
  }

  useEffect(() => {}, [partecipants]);

  getUsersInChan();

  return (
    <div
      style={{
        visibility: Prop.isVisible === true ? 'visible' : 'hidden',
        opacity: '1',
      }}
      className="overlay container-fluid row justify-content-center"
    >
      <div className="col-ms-10">
        <div className="group-search mb-sm-3 mb-md-0 contacts_card ">
          <div className="card-header">
            <span className="close_btn">
              <i
                className="fas fa-times fa-lg"
                onClick={(e) => Prop.setVisibility(!Prop.isVisible)}
              ></i>
            </span>
            <div className="card-body contacts_body row">
              <div className="group-info-box">
                <div className="info-username-image">
                  <img
                    alt="profile"
                    src={'./group_icon.png'}
                    className="profile-info-img"
                    style={{ marginTop: '10px' }}
                  />
                  <p className="profile-info-text username">
                    {Prop.chatInfo?.username}
                  </p>
                  <p className="profile-info-text">Group Type: </p>
                  <p className="profile-info-text">Group Type: </p>
                  <p className="profile-info-text">Group Type: </p>
                  <p className="profile-info-text">Group Type: </p>
                </div>
              </div>
              <div className="group-info-box">
                <div className="info-username-image">
                  <p className="profile-info-text username">Partecipants</p>
                  <div className="card-body contacts_body">
                    <ul className="contacts scrollable-search">
                      {partecipants.map((user: User) => {
                        const on = onlines.find(
                          (el) => user.id === el || user.id === -el
                        );
                        return (
                          <li key={user.id}>
                            <div
                              className="d-flex bd-highlight"
                              /* onClick={(e) => selectUser(e, user.id)} */
                              style={{ cursor: 'pointer' }}
                            >
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
                                    overlap="circular"
                                    invisible={false}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right',
                                    }}
                                    variant="dot"
                                  >
                                    <Avatar alt="Img" src={user.avatar} />
                                  </StyledBadge>
                                </Stack>
                              </div>
                              <div className="user_info">
                                <span>{user.username}</span>
                                <p>{user.username} is online</p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              {/* {channels.map((chan: ShortChannel, i) => {
            return (
              <li key={chan.id}>
                <Stack direction="row" spacing={2}>
                  <Avatar alt="Img" src={'./group_icon.png'} />
                </Stack>
                <ul
                  className="group-contacts scrollable-search"
                  id="horizontal-list"
                >
                  <div
                    className="d-flex bd-highlight"
                    onClick={(e) => selectChannel(e, chan)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="user_info">
                      <span>{chan.name}</span>
                      <p>{chan.id}</p>
                      <p>{chan.mode}</p>
                    </div>
                  </div>
                </ul>
              </li>
            );
          })} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

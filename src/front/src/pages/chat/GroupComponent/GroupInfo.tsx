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
import { stringify } from 'querystring';
import { NavLink } from 'react-router-dom';

interface Prop {
  isVisible: boolean;
  setVisibility: Function;
  chatInfo: ChatInfo | undefined;
}

interface UpdateGroup {
  name: string;
  mode: string;
  pass: string;
}

export default function GroupInfo(Prop: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const onlines = useContext(Context).online;

  const [partecipants, setPartecipants] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [updatedGroup, setUpdatedGroup] = useState<UpdateGroup>({
    name: '',
    mode: '',
    pass: '',
  });
  4;

  async function getUsersInChan() {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/UserInChannel/${Prop.chatInfo?.roomId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => setPartecipants(result));
  }

  async function checkAdmin(userId) {
   /*  TODO:API request to get current user's role */
  }

  useEffect(() => {}, []);

  checkAdmin(userId);
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
                    {isAdmin === false ? (
                      Prop.chatInfo?.username
                    ) : (
                      <div className="row justify-content-center">
                        <div className="col-4">
                          <label
                            htmlFor="username"
                            className="text-right form-label"
                          >
                            username
                          </label>
                        </div>
                        <>
                          <div className="col-auto">
                            <span className="form-text">
                              {updatedGroup?.name}
                            </span>
                          </div>
                          <div className="col-2">
                            <i
                              className="bi bi-pencil popup--form--icon"
                              onClick={() => setEditUsername(true)}
                            />
                          </div>
                        </>
                      </div>
                    )}
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
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="img_cont">
                                <Stack direction="row" spacing={2}>
								<NavLink to={'/users/' + user.username}>
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
								  </NavLink>
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

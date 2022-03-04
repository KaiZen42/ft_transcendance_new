import {
  Avatar,
  Button,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { Box } from '@mui/system';
import React, { useState, useEffect, useRef } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { CreationChannelPkg } from '../../models/Chat.interface';
import { User } from '../../models/User.interface';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import StyledBadge from '../../styles/StyleBage';
import zIndex from '@mui/material/styles/zIndex';

interface Prop {
  socket: Socket | undefined;
  userId: number;
  isVisible: string;
  setVisibility: Function;
}

export function CreateGroup({
  socket,
  userId,
  isVisible = 'hidden',
  setVisibility,
}: Prop) {
  /*   const [otherUser, setOtherUser] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [ch, setCreationChannel] = useState<CreationChannelPkg>(); */

  /*   const nameSubmit = (event: any) => {
    if (event.target.value) {
      event.preventDefault();
      (async () => {
        const data = await fetch(
          `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/username/${event.target.value}`,
          { credentials: 'include' }
        );
        const result = data.json();
        result.then((res) => {
          console.log(res);
          setUsers(
            res.sort((a: User, b: User) => a.username.localeCompare(b.username))
          );
        });
      })();
    } else {
      setUsers([]);
    }
  };

  function selectGroup(e: any, otherId: number) {
    console.log(otherId);
    setCreationChannel({
      idUser: userId,
      otherUser: otherId,
      pass: '',
      name: '',
    });
  } */

  /*   useEffect(() => {
    console.log(ch);
    if (ch?.otherUser !== userId) socket?.emit('createRoom', ch);
  }, [ch]); */
  return (
    <div
      style={{
        visibility: isVisible === 'hidden' ? 'hidden' : 'visible',
        opacity: '1',
      }}
      className="overlay"
    >
      <div className="group-create mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="input-group-prepend">
            <input
              type="text"
              placeholder="Insert a Group Name"
              name=""
              className="form-control search"
              //onChange={nameSubmit}
            />
            <span className="input-group-text search_btn">
              <i className="fas fa-check"></i>
            </span>
            <span className="input-group-text close_btn">
                <i
                  className="fas fa-times fa-lg"
                  onClick={(e) => setVisibility('hidden')}
                ></i>
              </span>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Add a User..."
              name=""
              className="form-control search"
              //onChange={nameSubmit}
            />
            <div className="input-group-prepend">
              <span className="input-group-text search_btn">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="card-body contacts_body">
          <ul className="contacts scrollable-search">
            {/* users.map((user: User) => (
              <li key={user.id}>
                <div
                  className="d-flex bd-highlight"
                  onClick={(e) => selectUser(e, user.id)}
                  style={{ cursor: 'pointer' }}
                >
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
            )) */}
          </ul>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
}

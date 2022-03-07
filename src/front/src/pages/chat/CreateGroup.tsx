import {
  Avatar,
  Button,
  Checkbox,
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
import { Margin } from '@mui/icons-material';

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

  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invite, setInvite] = useState<User[]>([]);
  const [privateGroup, setPrivateStatus ] = useState(false);
  const [ch, setCreationChannel] = useState<CreationChannelPkg>();
  const [groupPass, setGroupPass] = useState('');
  const nameSubmit = (event: any) => {
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

  /* function selectGroup(e: any, otherId: number) {
    console.log(otherId);
    setCreationChannel({
      idUser: userId,
      otherUser: otherId,
      pass: '',
      name: '',
    });
  }  */

  function addUser(e: any, user: User)
  {
    const id = invite.findIndex((us) => us.id == user.id);
    console.log("check", e.target.checked)
    
    if ( e.target.checked )
      setInvite(pred => {return [...pred, user]})
    else
      setInvite(pred => {
        pred.splice(id, 1)
        return  [...pred]})
  }

  /*   useEffect(() => {
    console.log(ch);
    if (ch?.otherUser !== userId) socket?.emit('createRoom', ch);
  }, [ch]); */

  useEffect(() => {
    console.log("INVITED USER ", invite)
  }, [invite])

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
          <div className="input-group-prepend" style={{marginBottom: 5}}>
            
            <input
              type="text"
              placeholder="Insert a Group Name"
              name=""
              className="form-control search"
              onChange={e => setGroupName(e.target.value)}
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
          <div className="input-group-prepend" style={{marginBottom: 5}}>
          <span className='glow'>Pass</span>
            <span>
              <input
                type="text"
                placeholder="Insert a Group Name"
                name=""
                className="form-control search"
                onChange={e => setGroupPass(e.target.value)}
              />
            </span>
            <span className="search_btn">
            <span className='glow'>Private </span>
            <Checkbox 
                    checked={privateGroup}
                    onChange={(e) => setPrivateStatus(e.target.checked)}/>
                    </span>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Add a User..."
              name=""
              className="form-control search"
              onChange={nameSubmit}
            />
            <div className="input-group-prepend">
              <span className="input-group-text search_btn">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        <ul className="contacts scrollable-search">
            {users.map((user: User) => (
              user.id === userId ? null:
              <li key={user.id}>
                <div
                  className="d-flex bd-highlight"
                  /* onClick={(e) => addUser(e, user)} */
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
                  </div>
                  <Checkbox 
                    checked={invite.findIndex((us) => us.id == user.id) === -1 ? 
                      false : true}
                    onChange={(e) => addUser(e, user)}/>
                </div>
              </li>
            ))}
          </ul>
        <div className="card-body contacts_body">
        <div className='glow'>NAME: {groupName}</div>
        <div className='glow'>Invite: {invite.map((inv : User) =>
          <span key={inv.id}> {inv.username} </span>
          )}</div>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
}

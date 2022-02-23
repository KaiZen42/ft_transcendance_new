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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

interface Prop {
  socket: Socket | undefined;
  userId: number;
}

export function UserList({ socket, userId }: Prop) {
  const [otherUser, setOtherUser] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [ch, setCreationChannel] = useState<CreationChannelPkg>();

  const nameSubmit = (event: any) => {
    console.log(event.target.value);
    if (!event.target.value) {
      // event.preventDefault();
      fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/users`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((result) => {
          setUsers(
            result.sort((a: User, b: User) =>
              a.username.localeCompare(b.username)
            )
          );
        });
    } else {
      event.preventDefault();
      fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/username/${event.target.value}`,
        { credentials: 'include' }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setUsers(
            result.sort((a: User, b: User) =>
              a.username.localeCompare(b.username)
            )
          );
        });
    }
  };

  function selectUser(e: any, otherId: number) {
    console.log(otherId);
    setCreationChannel({
      idUser: userId,
      otherUser: otherId,
      pass: '',
      name: '',
    });
  }

  useEffect(() => {
    console.log(ch);
    if (ch?.otherUser !== userId)
      socket?.emit('createRoom', ch);
  }, [ch]);

  // setClicked(false)
// 
  return (
    <div className="col-md-3 col-xl-3 chat">
      <div className="card-search mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search..."
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
		<div className="card-body contacts_body">
            <ul className="contacts scrollable-search">
        {users.map((user: User) => (
              <li key="user.id">
                <div className="d-flex bd-highlight">
                  <div className="img_cont" onClick={(e) => selectUser(e, user.id)}>
                    <Stack direction="row" spacing={2}>
                      <StyledBadge
                        overlap="circular"
                        invisible={true}
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
			))}
            </ul>
			</div>
        <div className="card-footer"></div>
      </div>
    </div>

    // <div>
    // 	<form className="form-inline"  onSubmit={nameSubmit}>
    // 			<div className="form-group mb-2">
    // 				<label>
    // 					<input type="text" value={name} onChange={e => setName(e.target.value)}/>
    // 				</label>
    // 				<input  type="submit" value="search" />
    // 			</div>
    // 	</form>
    // 		<List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    // 			{
    // 				users.map(user =>
    // 				{
    // 					return (
    // 					<ListItem key={user.id}
    // 					onClick={e => selectUser(e, user.id)}>
    // 						<ListItemButton>
    // 							<ListItemAvatar>
    // 								<Avatar src={user.avatar}/>
    // 							</ListItemAvatar>
    // 							<ListItemText id={"" + user.id} primary={user.username}/>
    // 						</ListItemButton>
    // 					</ListItem>
    // 				);
    // 				})
    // 			}
    // 		</List>
    // 	</div>
  );
}

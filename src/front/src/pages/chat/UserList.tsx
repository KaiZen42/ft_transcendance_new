import {
  Avatar,
  Button,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { Box } from '@mui/system';
import React, { useState, useEffect, useRef } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { CreationChannelPkg } from '../../models/Chat.interface';
import { User } from '../../models/User.interface';

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
    if (event.target.value === undefined) {
      event.preventDefault();
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
    socket?.emit('createRoom', ch);
  }, [ch]);

  return (
    <div className="col-md-4 col-xl-3 chat">
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
          <ul className="contacts">
            <li className="active">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <span className="online_icon"></span>
                </div>
                <div className="user_info">
                  <span>Khalid</span>
                  <p>Kalid is online</p>
                </div>
              </div>
            </li>
            <li>
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <span className="online_icon offline"></span>
                </div>
                <div className="user_info">
                  <span>Taherah Big</span>
                  <p>Taherah left 7 mins ago</p>
                </div>
              </div>
            </li>
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

import { Avatar, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { CreationChannelPkg } from '../../models/Chat.interface';
import { User } from '../../models/User.interface';
import StyledBadge from '../../styles/StyleBage';
import { Context } from '../../App';

export function UserList() {
  const onlines = useContext(Context).online;
  const socket = useContext(Context).socket;
  const userId = useContext(Context).userId;
  const [otherUser, setOtherUser] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [ch, setCreationChannel] = useState<CreationChannelPkg>();

  const nameSubmit = (event: any) => {
    if (event.target.value) {
      event.preventDefault();
      (async () => {
        const data = await fetch(
          `/api/users/likeusername/${event.target.value}`,
          { credentials: 'include' }
        );
        const result = data.json();
        result.then((res) => {
          setUsers(
            res.sort((a: User, b: User) => a.username.localeCompare(b.username))
          );
        });
      })();
    } else {
      setUsers([]);
    }
  };

  function selectUser(e: any, otherId: number) {
    setCreationChannel({
      idUser: userId,
      otherUser: otherId,
      pass: '',
      name: '',
      mode: 'PRI',
    });
  }

  useEffect(() => {
    if (ch !== undefined && ch?.otherUser !== userId)
      socket?.emit('createRoom', ch);
  }, [ch]);

  // setClicked(false)
  //
  return (
    <div className="col-md-3 col-xl-3 chat flexibility">
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
            {users.map((user: User) => {
              const on = onlines.find(
                (el) => user.id === el || user.id === -el
              );
              return user.id !== userId ? (
                <li key={user.id}>
                  <div
                    className="d-flex bd-highlight"
                    onClick={(e) => selectUser(e, user.id)}
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
              ) : null;
            })}
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

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
  const [users, setUsers] = useState<User[]>([]);
  const [ch, setCreationChannel] = useState<CreationChannelPkg>();
  const [searchName, setSearchName] = useState('');

  const nameSubmit = (name: string) => {
    if (name) {
      (async () => {
        const data = await fetch(`/api/users/likeusername/${name}`, {
          credentials: 'include',
        });
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
      invites: [],
    });
  }

  useEffect(() => {
    if (ch !== undefined && ch?.otherUser !== userId)
      socket?.emit('createRoom', ch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch]);

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
              onChange={(e) => {
                if (/^[a-zA-Z0-9-_]{0,20}$/.test(e.target.value)) {
                  setSearchName(e.target.value);
                  nameSubmit(e.target.value);
                }
              }}
              value={searchName}
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
  );
}

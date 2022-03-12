import { Avatar, Checkbox, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { CreationChannelPkg } from '../../../models/Chat.interface';
import { User } from '../../../models/User.interface';
import StyledBadge from '../../../styles/StyleBage';
import { Context } from '../../../App';

interface Prop {
  isVisible: string;
  setVisibility: Function;
}

export function CreateGroup({ isVisible = 'hidden', setVisibility }: Prop) {
  const onlines = useContext(Context).online;
  const socket = useContext(Context).socket;
  const userId = useContext(Context).userId;
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invite, setInvite] = useState<User[]>([]);
  const [privateGroup, setPrivateStatus] = useState(false);
  const [ch, setCreationChannel] = useState<CreationChannelPkg>();
  const [groupPass, setGroupPass] = useState('');
  const [missingName, setMissingName] = useState(false);

  const nameSubmit = (event: any) => {
    if (event.target.value) {
      event.preventDefault();
      (async () => {
        const data = await fetch(
          `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/likeusername/${event.target.value}`,
          { credentials: 'include' }
        );
        data.json().then((res) => {
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

  function addUser(e: any, user: User) {
    const id = invite.findIndex((us) => us.id == user.id);
    console.log('check', e.target.checked);

    if (e.target.checked)
      setInvite((pred) => {
        return [...pred, user];
      });
    else
      setInvite((pred) => {
        pred.splice(id, 1);
        return [...pred];
      });
  }

  function createGroup() {
    if (groupName === '') {
      setMissingName(true);
      return;
    }
    const roomBuilder: CreationChannelPkg = {
      idUser: userId,
      otherUser: undefined,
      pass: privateGroup ? '' : groupPass,
      name: groupName,
      mode: privateGroup ? 'PRI' : groupPass === '' ? 'PUB' : 'PRO',
    };
    socket?.emit('createRoom', roomBuilder);
    setVisibility('hidden');
  }

  useEffect(() => {
    console.log('INVITED USER ', invite);
  }, [invite]);

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
          {/* TODO:do it red */}
          <div className="glow" hidden={!missingName}>
            {' '}
            missing name
          </div>
          <div className="input-group-prepend" style={{ marginBottom: 5 }}>
            <input
              type="text"
              placeholder="Insert a Group Name"
              name=""
              className="form-control search"
              onChange={(e) => setGroupName(e.target.value)}
            />
            <span className="input-group-text search_btn" />
            <span className="input-group-text close_btn">
              <i
                className="fas fa-times fa-lg"
                onClick={(e) => setVisibility('hidden')}
              ></i>
            </span>
          </div>
          <div className="input-group-prepend" style={{ marginBottom: 5 }}>
            <span className="glow">Pass</span>
            <span>
              <input
                type="text"
                placeholder="Insert a Group Name"
                name=""
                className="form-control search"
                onChange={(e) => setGroupPass(e.target.value)}
                value={privateGroup ? '🚫Disabled🚫' : groupPass}
                disabled={privateGroup}
              />
            </span>
            <span className="search_btn">
              <span className="glow">Private </span>
              <Checkbox
                checked={privateGroup}
                onChange={(e) => setPrivateStatus(e.target.checked)}
              />
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
          {users.map((user: User) => {
            const on = onlines.find((el) => user.id === el || user.id === -el);
            return user.id === userId ? null : (
              <li key={user.id}>
                <div
                  className="d-flex bd-highlight"
                  /* onClick={(e) => addUser(e, user)} */
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
                  </div>
                  <Checkbox
                    checked={
                      invite.findIndex((us) => us.id == user.id) === -1
                        ? false
                        : true
                    }
                    onChange={(e) => addUser(e, user)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="card-body contacts_body">
          <div className="glow">NAME: {groupName}</div>
          <div className="glow">
            Invite:{' '}
            {invite.map((inv: User) => (
              <span key={inv.id}> {inv.username} </span>
            ))}
          </div>
        </div>
        <div className="card-footer"></div>
        <div className="right">
          <span className="input-group-text close_btn ">
            <i className="fas fa-check" onClick={(e) => createGroup()}></i>
          </span>
        </div>
      </div>
    </div>
  );
}

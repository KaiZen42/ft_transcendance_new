import { Avatar, Stack } from '@mui/material';
import { useEffect, useContext } from 'react';
import {
  channelRequestPkj,
  FullPartecipant,
  Partecipant,
} from '../../../models/Chat.interface';
import StyledBadge from '../../../styles/StyleBage';
import { Context } from '../../../App';
import { NavLink } from 'react-router-dom';

interface Prop {
  part: FullPartecipant;
  on: number | undefined;
  myInfo: Partecipant;
  setRequest: Function;
}

export default function UserGroup({ part, on, myInfo, setRequest }: Prop) {
  const user = part.userId;
  const cont = useContext(Context);

  function confirm(type: string, name: string) {
    const req: channelRequestPkj = {
      sender: cont.userId,
      reciver: user.id,
      channelId: part.channelId,
      type: type,
      reciverName: name,
      time: 0,
    };
    setRequest(req);
  }

  useEffect(() => {}, [part]);

  return (
    <div className="d-flex bd-highlight" style={{ cursor: 'pointer' }}>
      <div className="img_cont">
        <Stack direction="row" spacing={2}>
          <NavLink to={'/users/' + user.username}>
            <StyledBadge
              color={
                on !== undefined ? (on > 0 ? 'success' : 'warning') : 'error'
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
        <p>
          {part.mod === 'o' ? 'Owner' : part.mod === 'm' ? 'Member' : 'Admin'}
        </p>
      </div>
      {cont.userId === user.id ||
      part.mod === 'o' ||
      myInfo.mod === 'm' ? null : (
        <span className="input-group-text close_btn">
          <i
            className="fas fa-ban"
            onClick={(e) => confirm('ban', user.username)}
          ></i>
          <i
            className="fab fa-korvue"
            onClick={(e) => confirm('kick', user.username)}
          ></i>
          {part.mod === 'm' ? (
            <i
              className="fas fa-level-up-alt"
              onClick={(e) => confirm('upgrade', user.username)}
            ></i>
          ) : (
            <i
              className="fas fa-level-down-alt"
              onClick={(e) => confirm('downgrade', user.username)}
            ></i>
          )}
          {part.muted === 0 ? (
            <i
              className="fas fa-comment-slash"
              onClick={(e) => confirm('mute', user.username)}
            ></i>
          ) : (
            <i
              className="fas fa-comment"
              onClick={(e) => confirm('unmute', user.username)}
            ></i>
          )}
        </span>
      )}
    </div>
  );
}

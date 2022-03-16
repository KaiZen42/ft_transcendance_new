import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io';
import { Context } from '../App';
import { User } from '../models/User.interface';
import ProfilePopUp from './ProfilePopUp';

export default function ProfileInfo({
  username,
  setUsername,
  myProfilePage,
  setUserId,
  me,
}: {
  username: string;
  setUsername: (newName: string) => void;
  myProfilePage: boolean;
  setUserId: (id: number) => void;
  me: User | null;
}) {
  //const myId: number = useContext(Context).userId!;
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<User | null>();
  const [friendStatus, setFriendStatus] = useState('');
  const onlines = useContext(Context).online;
  const socket = useContext(Context).socket;

  const navigate = useNavigate();

  const checkOnline = (id: number) => {
    if (onlines.findIndex((online) => online === id) !== -1) return 'online';
    if (onlines.findIndex((online) => online === -id) !== -1) return 'ingame';
    return 'offline';
  };

  useEffect(() => {
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/username/` +
        username,
      {
        method: 'GET',
        credentials: 'include',
      }
    ).then((res) => {
      res.json().then((data) => {
        if (!data.id) setUser(null);
        else {
          setUser(data);
          setUserId(data.id);
        }
      });
    });
  }, [username]);

  useEffect(() => {
    if (!user || myProfilePage || !me) return;
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/getFriendStatus/` +
        me.id +
        '?other=' +
        user.id
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setFriendStatus(data.status);
      });
  }, [user, myProfilePage, me, username]);

  const updateUser = async (updatedUser: User) => {
    await axios.put(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/update/${updatedUser.id}`,
      { ...updatedUser }
    );
    setUsername(updatedUser.username);
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
    navigate('/users/' + updatedUser.username);
  };

  const sendFriendRequest = () => {
    const data = {
      requesting: me?.id,
      receiving: user?.id,
    };
    axios.post(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/friendRequest`,
      data
    );
    setFriendStatus('REQUESTED');
  };

  const friendlyMatch = () => {
    socket!.emit('friendlyMatch', {
      requesting: { id: me?.id, username: me?.username },
      receving: user?.id,
    });
    navigate('/game', {
      state: {
        id: user?.id,
        username: user?.username,
        avatar: user?.avatar,
        requesting: true,
      },
    });
  };

  return (
    <>
      {user && (
        <>
          <div className="info-username-image">
            <img
              alt="profile"
              src={user?.avatar}
              className="profile-info-img"
            />
            <p className="profile-info-text username">{user.username}</p>
            {!myProfilePage && (
              <div className={`my-dot ${checkOnline(user.id)}`} />
            )}
          </div>
          <div className="profile-info-stats">
            <p className="profile-info-text">
              {user.points} <small>pts</small>
            </p>
            <div className="winslosses">
              <p className="profile-info-text">wins-losses: </p>
              <p
                className={`profile-info-text ${
                  user.wins! > user.losses!
                    ? 'border-pos'
                    : user.losses! > user.wins!
                    ? 'border-neg'
                    : 'nice-border'
                }`}
              >
                {user.wins}-{user.losses}
              </p>
            </div>
          </div>
          <div className="profile-info-submit">
            {myProfilePage ? (
              <button
                className="game-popup-btn btn-home"
                onClick={() => setEdit(true)}
              >
                EDIT
                <br />
                PROFILE
              </button>
            ) : (
              <>
                {!friendStatus ? (
                  <button
                    className="game-popup-btn btn-home"
                    onClick={sendFriendRequest}
                  >
                    <>
                      FRIEND
                      <br />
                      REQUEST
                    </>
                  </button>
                ) : friendStatus === 'REQUESTED' ? (
                  <button className="game-popup-btn btn-home" disabled>
                    REQUESTED
                  </button>
                ) : checkOnline(user.id) === 'ingame' ? (
                  <button
                    className="game-popup-btn btn-home"
                    onClick={() => {}}
                  >
                    <>
                      WATCH
                      <br />
                      GAME
                    </>
                  </button>
                ) : (
                  <button
                    className="game-popup-btn btn-home"
                    onClick={friendlyMatch}
                    disabled={checkOnline(user.id) === 'offline'}
                  >
                    <>
                      FRIENDLY
                      <br />
                      MATCH
                    </>
                  </button>
                )}
              </>
            )}
          </div>
          <ProfilePopUp
            onClose={() => setEdit(false)}
            show={edit}
            user={user!}
            updateState={updateUser}
          />
        </>
      )}
      {user === null && <Navigate to="/404" />}
    </>
  );
}

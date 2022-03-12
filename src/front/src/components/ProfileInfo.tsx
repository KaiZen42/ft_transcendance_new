import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User } from '../models/User.interface';
import Error404 from '../pages/404';
import ProfilePopUp from './ProfilePopUp';

export default function ProfileInfo({
  username,
  setUsername,
  myProfilePage,
  setUserId,
}: {
  username: string;
  setUsername: (newName: string) => void;
  myProfilePage: boolean;
  setUserId: (id: number) => void;
}) {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<User | null>();

  const navigate = useNavigate();

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

  const updateUser = async (updatedUser: User) => {
    const res = await axios.put(
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
                <button className="game-popup-btn btn-home">
                  FRIEND
                  <br />
                  REQUEST
                </button>
                <button className="game-popup-btn btn-play">BLOCK</button>
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

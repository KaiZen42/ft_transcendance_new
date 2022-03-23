import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../models/User.interface';
import { NavLink } from 'react-router-dom';
import '../styles/Nav.css';
import { Context } from '../App';
import FriendlyMatchPopUp from './FriendlyMatchPopUp';

interface Friend {
  id: number;
  username: string;
}

export default function Nav({ noImage }: { noImage?: boolean }) {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  const socket = useContext(Context).socket;
  const [friend, setFriend] = useState<Friend>();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/api/user`, { withCredentials: true });
      setUser(data);
    })();
    socket?.on('friendlyMatch', handleFriendlyMatch);
  }, [socket, noImage]);

  const handleFriendlyMatch = (friend: { id: number; username: string }) => {
    setFriend({
      ...friend,
    });
  };

  async function signOutUser() {
    await fetch(`/api/logout`, {
      credentials: 'include',
    });
    window.location.reload();
  }

  return (
    <>
      <header className="header">
        <h2
          className="header--title"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          TRASCENDANCE
        </h2>

        <ul className="header--icon--list">
          <li>
            <NavLink to={'/'}>
              <i className="bi bi-house header--icon"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={'/leaderboard'}>
              <i className="bi bi-graph-up-arrow header--icon"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={'/chat'}>
              <i className="bi bi-chat header--icon" />
            </NavLink>
          </li>
        </ul>
        <div className="header--signout">
          {!noImage && (
            <div
              className="header--photo_name"
              onClick={() => navigate('/users/' + user?.username)}
            >
              <img alt="profile" src={user?.avatar} className="nav--image" />
              <div className="header--text">{user?.username}</div>
            </div>
          )}
          <i
            className="bi bi-box-arrow-right header--icon"
            onClick={signOutUser}
          ></i>
        </div>
      </header>
      <FriendlyMatchPopUp
        friend={friend}
        user={user}
        onClose={() => setFriend(undefined)}
      />
    </>
  );
}

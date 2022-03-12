import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../models/User.interface';
import { NavLink } from 'react-router-dom';
import '../styles/Nav.css';
import { Badge } from '@mui/material';

export default function Nav({ noImage }: { noImage?: boolean }) {
  const [user, setUser] = useState<User>();
  const [invisible, setInvisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`,
        { withCredentials: true }
      );
      setUser(data);
    })();
  }, []);

  async function signOutUser() {
    await fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/logout`, {
      credentials: 'include',
    });
    window.location.reload();
  }

  return (
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
            <i className="bi bi-chat header--icon">
              <Badge
                color="secondary"
                badgeContent="1"
                invisible={invisible}
              ></Badge>
            </i>
          </NavLink>
        </li>
      </ul>
      <div className="header--signout">
        {!noImage && (
          <div
            className="header--photo_name"
            onClick={() => navigate('/users/' + user?.username)}
          >
            <img
              alt="profile image"
              src={user?.avatar}
              className="nav--image"
            />
            <div className="header--text">{user?.username}</div>
          </div>
        )}
        <i
          className="bi bi-box-arrow-right header--icon"
          onClick={signOutUser}
        ></i>
      </div>
    </header>
  );
}

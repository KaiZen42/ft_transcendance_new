import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileInfo from '../components/ProfileInfo';
import Wrapper from '../components/Wrapper';
import { User } from '../models/User.interface';
import '../styles/Profile.css';
import Error404 from './404';

export default function Profile() {
  const { username } = useParams<'username'>();
  const [me, setMe] = useState<User>();
  const [myProfilePage, setMyProfilePage] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`,
        { withCredentials: true }
      );
      setMe(data);
    })();
  }, []);

  useEffect(() => {
    if (!me) return;
    (async () => {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/matches/player/${me?.id}`,
        { withCredentials: true }
      );
    })();
  }, [me]);

  useEffect(() => {
    if (!(me && username)) return;
    if (me.username === username) setMyProfilePage(true);
  }, [me, username]);

  return (
    <>
      {username ? (
        <Wrapper noImage={myProfilePage}>
          <div className="profile-content">
            <div className="profile-box profile-info">
              <ProfileInfo username={username} myProfilePage={myProfilePage} />
            </div>
            <div className="profile-box last-games">
              {' '}
              <h1>last games</h1>{' '}
            </div>
            <div className="profile-box friend-list">
              <h1>friend list</h1>
            </div>
          </div>
        </Wrapper>
      ) : (
        <Error404 />
      )}
    </>
  );
}

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MatchList from '../components/MatchList';
import ProfileInfo from '../components/ProfileInfo';
import Wrapper from '../components/Wrapper';
import { User } from '../models/User.interface';
import '../styles/Profile.css';
import Error404 from './404';

export default function Profile() {
  const { username } = useParams<'username'>();
  const [me, setMe] = useState<User>();
  const [myProfilePage, setMyProfilePage] = useState(false);

  const [userId, setUserId] = useState<number>();

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
    if (!(me && username)) return;
    if (me.username === username) setMyProfilePage(true);
    else setMyProfilePage(false);
  }, [me, username]);

  return (
    <>
      {username ? (
        <Wrapper noImage={myProfilePage}>
          <div className="profile-content">
            <div className="profile-box profile-info">
              <ProfileInfo
                username={username}
                setUsername={(newName: string) =>
                  setMe((prevMe) => ({
                    ...prevMe!,
                    username: newName,
                  }))
                }
                myProfilePage={myProfilePage}
                setUserId={(id: number) => setUserId(id)}
              />
            </div>
            <div className="profile-box last-games">
              <MatchList userId={userId ? userId : 0} />
            </div>
            <div className="profile-box friend-list">
              <h1 className="profile-info-text username">friend list</h1>
            </div>
          </div>
        </Wrapper>
      ) : (
        <Error404 />
      )}
    </>
  );
}

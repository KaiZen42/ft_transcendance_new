import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileInfo from '../components/ProfileInfo';
import Wrapper from '../components/Wrapper';
import { User } from '../models/User.interface';
import '../styles/Profile.css';
import Error404 from './404';

interface MatchUser {
  id: number;

  player1: {
    username: string;
    avatar: string;
  };

  player2: {
    username: string;
    avatar: string;
  };

  points1: number;

  points2: number;
}

export default function Profile() {
  const { username } = useParams<'username'>();
  const [me, setMe] = useState<User>();
  const [myProfilePage, setMyProfilePage] = useState(false);
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [userId, setUserId] = useState<number>();

  const navigate = useNavigate();

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
    if (!userId) return;
    (async () => {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/matches/player/${userId}`,
        { withCredentials: true }
      );
      console.log(data);
      setMatches(data);
    })();
  }, [userId]);

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
              <ProfileInfo
                username={username}
                myProfilePage={myProfilePage}
                setUserId={(id: number) => setUserId(id)}
              />
            </div>
            <div className="profile-box last-games">
              {' '}
              <h1 className="profile-info-text username">last games</h1>
              {matches.map((match) => (
                <div className="match-item">
                  <div
                    className="image-username"
                    onClick={() => navigate('/users/' + match.player1.username)}
                  >
                    <img
                      alt="profile image"
                      src={match.player1.avatar}
                      className="profile-info-img sm"
                    />
                    <p>{match.player1.username}</p>
                  </div>
                  <div className="match-score">
                    <p>{match.points1}</p>
                    <p> - </p>
                    <p>{match.points2}</p>
                  </div>
                  <div
                    className="image-username"
                    onClick={() => navigate('/users/' + match.player2.username)}
                  >
                    <img
                      alt="profile image"
                      src={match.player2.avatar}
                      className="profile-info-img sm"
                    />
                    <p className="nice-border">{match.player2.username}</p>
                  </div>
                </div>
              ))}
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

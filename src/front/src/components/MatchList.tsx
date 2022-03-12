import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../models/User.interface';

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

export default function MatchList({ userId }: { userId: number }) {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const { username } = useParams<'username'>();

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/matches/player/${userId}`,
        { withCredentials: true }
      );
      setMatches(data);
    })();
  }, [userId]);

  return (
    <>
      <div className="last-games-title">
        <h1
          className="profile-info-text username"
          style={{ marginBottom: '0' }}
        >
          last games
        </h1>
      </div>

      {matches.length !== 0 ? (
        <div className="match-list">
          {matches.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
              myUsername={username ? username : ''}
            />
          ))}
        </div>
      ) : (
        <div style={{ height: '90%', display: 'grid', placeItems: 'center' }}>
          no matches yet
        </div>
      )}
    </>
  );
}

function MatchItem({
  match,
  myUsername,
}: {
  match: MatchUser;
  myUsername: string;
}) {
  const [me, setMe] = useState<{
    username: string;
    avatar: string;
    points: number;
  }>();
  const [opponent, setOpponent] = useState<{
    username: string;
    avatar: string;
    points: number;
  }>();

  const navigate = useNavigate();

  useEffect(() => {
    if (match.player1.username === myUsername) {
      setMe({ ...match.player1, points: match.points1 });
      setOpponent({ ...match.player2, points: match.points2 });
    } else {
      setMe({ ...match.player2, points: match.points2 });
      setOpponent({ ...match.player1, points: match.points1 });
    }
  }, [match, myUsername]);

  return (
    <>
      {me && opponent && (
        <div
          className={`match-item match-${
            me.points > opponent.points ? 'win' : 'loss'
          }`}
        >
          <div className="image-username">
            <img
              alt="profile image"
              src={me.avatar}
              className="profile-info-img sm"
            />
            <p>{me.username}</p>
          </div>
          <div className="match-score">
            <p>{me.points}</p>
            <p> - </p>
            <p>{opponent.points}</p>
          </div>
          <div
            className="image-username"
            onClick={() => navigate('/users/' + opponent.username)}
          >
            <img
              alt="profile image"
              src={opponent.avatar}
              className="profile-info-img sm"
            />
            <p className="nice-border">{opponent.username}</p>
          </div>
        </div>
      )}
    </>
  );
}

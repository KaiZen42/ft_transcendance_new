import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Leaderboard.css';

interface TmpUser {
  id: string;
  avatar: string;
  username: string;
  wins: number;
  losses: number;
  points: number;
}

interface Props {
  user: TmpUser;
  pos: number;
}

export default function LeaderboardRow({ user, pos }: Props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  return (
    <li
      className={`table-row ${
        pos === 0 ? 'first' : pos === 1 ? 'second' : pos === 2 ? 'third' : ''
      }`}
      onClick={() =>
        navigate('/users/' + user.username, { state: { userId: user.id } })
      }
    >
      <div className="leaderboard-col board-col-1">{pos + 1}</div>
      <div className="leaderboard-col board-col-2">
        <img src={user.avatar} />
        <p>{user.username}</p>
      </div>
      <div className="leaderboard-col board-col-3">{user.points}</div>
      <div
        className={`leaderboard-col board-col-4 ${
          user.wins > user.losses
            ? 'positive'
            : user.losses > user.wins
            ? 'negative'
            : ''
        }`}
      >{`${user.wins}-${user.losses}`}</div>
    </li>
  );
}

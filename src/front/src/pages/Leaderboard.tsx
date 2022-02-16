import { useEffect, useState } from 'react';
import Wrapper from '../components/Wrapper';
import '../styles/Leaderboard.css';
import LeaderboardRow from '../components/LeaderboardRow';

interface DisplayUser {
  id: string;
  avatar: string;
  username: string;
  wins: number;
  losses: number;
  points: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<DisplayUser[]>([]);

  useEffect(() => {
    async function getter() {
      let res = await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/leader`
      );
      let users = await res.json();
      setUsers(users);
    }

    getter();
  }, []);

  return (
    <Wrapper>
      <div className="leaderboard">
        <h2>LEADERBOARD</h2>
        <ul className="my-responsive-table">
          <li className="table-header">
            <div className="leaderboard-col board-col-1">POS</div>
            <div className="leaderboard-col board-col-2">USER</div>
            <div className="leaderboard-col board-col-3">POINTS</div>
            <div className="leaderboard-col board-col-4">WINS-LOSSES</div>
          </li>
        </ul>
        <ul className="my-responsive-table scrollable thumb">
          {users.map((user: DisplayUser, pos: number) => (
            <LeaderboardRow key={user.id} user={user} pos={pos} />
          ))}
        </ul>
		</div>
    </Wrapper>
  );
}

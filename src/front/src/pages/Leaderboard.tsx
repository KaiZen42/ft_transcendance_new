
import axios from "axios";
import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";
import usersData from "./usersExample.js"
import "../styles/Leaderboard.css"
import LeaderboardRow from "../components/LeaderboardRow";

interface TmpUser {
	id: string,
	avatar: string,
	username: string,
	wins: number,
	losses: number,
	points: number
}

export default function Leaderboard() {

  const [users, setUsers] = useState<TmpUser[]>([]);

  useEffect(() => {
    /*console.log("TEST ");
    async function test(){
      const response = await axios.get<User[]>(`http://${process.env.REACT_APP_BASE_IP}:3000/api/users`);
      setUsers( response.data );
    }
    test();*/
    setUsers(usersData.users)
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
          {
            users.map((user:TmpUser, pos:number) => <LeaderboardRow user={user} pos={pos}/>)
          }
        </ul> 
      </div>
    </Wrapper>
  );
}

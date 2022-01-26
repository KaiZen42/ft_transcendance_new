
import axios from "axios";
import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";

export default function Leaderboard() {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    console.log("TEST ");
    async function test(){
      const response = await axios.get<User[]>('http://localhost:3000/api/users');
      setUsers( response.data );
    }
    test();
  }, []);

  return (
    <Wrapper>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">image</th>
              <th scope="col">username</th>
              {/* <th scope="col">Header</th>
              <th scope="col">Header</th>
              <th scope="col">Header</th> */}
            </tr>
          </thead>
          <tbody>
              {
                users.map((user: User) => {
                  return (
                    <tr>
                      <td><img src={user.avatar} width="40px"/></td>
                      <td>{user.username}</td>
                    </tr>
                  )
                })
              }
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}

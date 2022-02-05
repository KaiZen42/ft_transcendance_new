import axios from "axios";
import React, { useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";

export default function Dashboard() {
  	const [user, setUser] = useState<User>();
	
	useEffect(() => {(
	async () => {
		const {data} = await axios.get(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {withCredentials: true});
		setUser(data);
	}
	)();
	}, []);

  return (
    <Wrapper>
		<NavLink to={'/game'}>
            <button>PLAY PONG</button>
        </NavLink>
    </Wrapper>
  );
}

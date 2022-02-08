import axios from "axios";
import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";

export default function Profile() {

	const [user, setUser] = useState<User>();

    useEffect(() => {(
      async () => {
        const {data} = await axios.get(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {withCredentials: true});
        setUser(data);
      }
    )();
    }, []);

	return(
		<Wrapper>
			<img src={user?.avatar}/>
			<p>Username: {user?.username}</p>
			<p>Wins: 0</p>
			<p>Losses: 0</p>
		</Wrapper>
	)
}
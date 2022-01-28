import axios from "axios";
import React, { useEffect, useState} from "react";
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
      <div>
        {/* <img src={user?.avatar} width="250px"/>
		<form>
			<label className="btn btn-primary">
			Upload image
			<input type="file" hidden onChange={e => upload(e.target.files)} />
			</label>
        </form> */}
      </div>
    </Wrapper>
  );
}

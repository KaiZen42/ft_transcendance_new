import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { blue } from "@mui/material/colors";
import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { CreationChannel } from "../../models/CreationChannel.interface";
import { Message } from "../../models/Message.interface";
import { User } from "../../models/User.interface";

interface Prop
{
	socket : Socket | undefined,
	userId : number
}

export function UserList({socket, userId} : Prop) {
	const [otherUser, setOtherUser] = useState(0);
	const [name, setName] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [ch, setCreationChannel] = useState<CreationChannel>();


	const nameSubmit = (event: any) => {
		if (name === "")
		{
			event.preventDefault();
			fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/users`, {credentials: 'include'})
				.then(response => response.json())
				.then(result => { setUsers(result
					.sort((a: User, b: User) => (a.username.localeCompare(b.username)))
					); });
		}
		else
		{
			event.preventDefault();
			fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/users/username/${name}`, {credentials: 'include'})
				.then(response => response.json())
				.then(result => { setUsers(result
					.sort((a: User, b: User) => (a.username.localeCompare(b.username)))
					); });
		}
		
	}

	function selectUser (e:any, otherId: number  )
	{
		console.log(otherId);
		setCreationChannel(
			{idUser : userId,
			otherUser: otherId,
			pass : "",
			name : ""}
		);
	}

		useEffect(
			() =>{
				console.log(ch);
				socket?.emit("createRoom", ch);
			},[ch]);

	return(
		<div>
		
			<form onSubmit={nameSubmit} >
				<label>
					<input type="text" value={name} onChange={e => setName(e.target.value)}/>
				</label>
				<input type="submit" value="search" />
			</form>
			<List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
				{
					users.map(user =>
					{
						return (
						<ListItem key={user.id}
						onClick={e => selectUser(e, user.id)}>
							<ListItemButton>
								<ListItemAvatar>
									<Avatar src={user.avatar}/>
								</ListItemAvatar>
								<ListItemText id={"" + user.id} primary={user.username}/>
							</ListItemButton>
						</ListItem>
					);
					})
				}
			</List>
		</div>
	);
}


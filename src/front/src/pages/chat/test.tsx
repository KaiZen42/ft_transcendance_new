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

export function Test({socket, userId} : Prop) {
	const [otherUser, setOtherUser] = useState(0);
	const [name, setName] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [ch, setCreationChannel] = useState<CreationChannel>();


	const nameSubmit = (event: any) => {
		event.preventDefault();
		fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => { setUsers(result); });
	}

	const handleSubmit = (event: any) => {
		event.preventDefault();
		
		socket?.emit("createRoom", ch);
		console.log(ch);
		}
		useEffect(
			() =>{
				setCreationChannel(
					{idUser : userId,
					otherUser: otherUser,
					pass : "",
					name : ""}
				);
			},[otherUser]);

	return(
		<div >
			
			{/* <form onSubmit={handleSubmit} >
				<label>
					<input type="number" value={otherUser} onChange={e => setOtherUser(parseInt(e.target.value))}/>
				</label>
				<input type="submit" value="Bind" />
			</form> */}
		
			<form onSubmit={nameSubmit} >
				<label>
					<input type="text" value={name} onChange={e => setName(e.target.value)}/>
				</label>
				<input type="submit" value="search" />
			</form>
			<ul className="list-group">
				<li className="list-group-item d-flex justify-content-between align-items-center">
					name
					<span>n</span>
				</li>
			</ul>
		</div>
	);
}


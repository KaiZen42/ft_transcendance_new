import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import MessageBox from "./MessageBox";
import { User } from "../../models/User.interface";
import axios from "axios";
import { Message } from "../../models/Message.interface";
import { response } from "express";
import { CreationChannel } from "../../models/CreationChannel.interface";
const WS_SERVER =`http://${process.env.REACT_APP_BASE_IP}:3000/chat`;


let idx : number = 0;

export function Chat(/* {user} : Prop */) {

	const [pkg, setPkg] = useState<Message>();

	const [socket, setSocket] = useState<Socket>();
	const [otherUser, setOtherUser] = useState(0);
	const [ch, setCreationChannel] = useState<CreationChannel>();

	function getUser()
	{
		  fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => { 
					setPkg({
						idUser : result.id,
						room : "",
						user : result.username,
						data : "",
					});});
	};

	useEffect(
		() =>{
			if (pkg === undefined)
				getUser();
			const sock = io(WS_SERVER);
			setSocket(sock);
			sock.on("connect", () => 
			{
				console.log('connected')
			});
			return () => {sock.close()};
		} ,[]);


	const handleSubmit = (event: any) => {
			event.preventDefault();
			setCreationChannel(
				{idUser : pkg?.idUser,
				otherUser: 55,
				pass : "",
				name : ""}
			);
			socket?.emit("createRoom", ch);
	};

	return (
		socket === undefined ?  (<Wrapper> <div>Not Connected</div> </Wrapper>)
		: (
			<Wrapper>
			<div>
				<form onSubmit={handleSubmit} >
					<label>
						<input type="text" value={otherUser} onChange={e => setOtherUser(+e.target.value)}/>
					</label>
					<input type="submit" value="Bind" />
				</form>
			</div>
			<MessageBox socket={socket}/>
			{pkg === undefined ? (null) : (<Sender socket={socket} packet={pkg}/>)}
			</Wrapper>    
	)
	);
}

export default Chat;

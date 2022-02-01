import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import MessageBox from "./MessageBox";
import { User } from "../../models/User.interface";
import axios from "axios";
import { Message } from "../../models/Message.interface";
import { response } from "express";
const WS_SERVER =`http://${process.env.REACT_APP_BASE_IP}:3000/chat`;


let idx : number = 0;

export function Chat(/* {user} : Prop */) {

	const [pkg, setPkg] = useState<Message>();
	const [socket, setSocket] = useState<Socket>();


	 function getUser()
	{
		  fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => { 
					setPkg({
						id : idx++,
						idUser : result.id,
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

	return (
		socket === undefined ?  (<Wrapper> <div>Not Connected</div> </Wrapper>)
		: (
			<Wrapper>

			<MessageBox socket={socket}/>
			{	console.log(pkg)}
			{pkg === undefined ? (4) : (<Sender socket={socket} packet={pkg}/>)}
			</Wrapper>    
	)
	);
}

export default Chat;

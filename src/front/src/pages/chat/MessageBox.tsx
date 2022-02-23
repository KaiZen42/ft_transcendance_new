import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import {  MessagePkg } from "../../models/Chat.interface";

interface Prop
{
	socket : Socket | undefined,
	room: string
	userId: number;
}

let key: number = 0;
export default function MessageBox({socket, room, userId}: Prop)
{
	const [chats, setChats] = useState<MessagePkg[]>([]);
	console.log("Render mex box");


	const messageListener = (message: MessagePkg) => {
		//let newChat = chats;
		//newChat.push(message);
		console.log("ARRIVED: ", message);
		if (message.room == room)
			setChats(prevChat =>{ return [...prevChat,  message]});
		console.log(chats);
	}

	useEffect(() =>{
		console.log("ACTUAL ROOM ", room);
		if (chats.length === 0 ||  chats[0].room !== room)
		{
			fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/CHmessage/${+room}`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => setChats(result));
			socket?.on('message', messageListener);
		}
	},[socket,room]);
	
	return(

			
			<div>
			{chats.map((msg: MessagePkg) => {return(
				<div className={msg.userId.id === userId ? "d-flex justify-content-start mb-4" 
					: "d-flex justify-content-end mb-4"}>
					<div className="img_cont_msg"></div>
					<div className="msg_cotainer">
						{msg.data}
						<span className="msg_time">8:40 AM, Today</span>
					</div>
				</div>
			)})}
			
		</div>
	);
}


{/* <div>
			<p>MESSAGES:</p>
			
			{ chats.map(msg => (<p key={key++}> {msg.userId.username}: {msg.data} </p>))}
		</div> */}

	/* 	<div className="d-flex justify-content-start mb-4">
			<div className="img_cont_msg"></div>
			<div className="msg_cotainer">
				Hi, how are you samim?
				<span className="msg_time">8:40 AM, Today</span>
			</div>
		</div>
		
		<div className="d-flex justify-content-end mb-4">
			<div className="msg_cotainer_send">
				Hi Khalid i am good tnx how about you?
				<span className="msg_time_send">8:55 AM, Today</span>
			</div>
			<div className="img_cont_msg"></div>
		</div> */

import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import {  MessagePkg } from "../../models/Chat.interface";

interface Prop
{
	socket : Socket | undefined,
	room: string
}

let key: number = 0;
export default function MessageBox({socket, room}: Prop)
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
			fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/chat/CHmessage/${+room}`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => setChats(result));
			socket?.on('message', messageListener);
		}
	},[socket,room]);

	return(
		<div>
			<p>MESSAGES:</p>
			{console.log("CHATS: ", chats)}
			{ chats.map(msg => (<p key={key++}> {msg.userId.username}: {msg.data} </p>))}
		</div>
	);
}
import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import { Message } from "../../models/Message.interface";

interface Prop
{
	socket : Socket | undefined,
	room: string
}

let key: number = 0;
export default function MessageBox({socket, room}: Prop)
{
	const [chats, setChats] = useState<Message[]>([]);
	console.log("Render mex box");

	useEffect(() =>{
		console.log("CHATS: ", chats);
		fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/chat/CHmessage/${+room}`, {credentials: 'include'})
		.then(response => response.json())
		.then(result => setChats(prevChat =>{ return [...prevChat,  result]}));
		const messageListener = (message: any) => {
			//let newChat = chats;
			//newChat.push(message);
			console.log(message);
			setChats(prevChat =>{ return [...prevChat,  message]});
			console.log("message recived: ");
		  	console.log(message);
			console.log(chats);
		}
		socket?.on('message', messageListener);
	},[socket,room]);

	return(
		<div>
			<p>MESSAGES:</p>
			{ chats.map(msg => (<p key={key++}> {msg.user}: {msg.data} </p>)) }
		</div>
	);
}
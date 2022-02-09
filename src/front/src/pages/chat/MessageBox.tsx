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

export default function MessageBox({socket, room}: Prop)
{
	const [chats, setChats] = useState<Message[]>([]);
	console.log("Render mex box");

	useEffect(() =>{
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
	},[socket]);

	return(
		<div>
			<p>MESSAGES:</p>
			{ chats.map(msg => (<p key="msg"> {msg.user}: {msg.data} </p>)) }
		</div>
	);
}
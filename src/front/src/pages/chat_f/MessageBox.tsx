import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import { Message } from "../../models/Message.interface";

interface Prop
{
	socket : Socket | undefined,
}

export default function MessageBox({socket}: Prop)
{
	const [chats, setChats] = useState<Message[]>([]);
	console.log("É arrivato:");

	useEffect(() =>{
		const messageListener = (message: Message) => {
			//let newChat = chats;
			//newChat.push(message);
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
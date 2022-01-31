import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";

interface Prop
{
	socket : Socket | undefined,
}

export default function MessageBox({socket}: Prop)
{
	const [chats, setChats] = useState<String[]>([]);
	console.log("É arrivato:");

	useEffect(() =>{
		const messageListener = (message: string) => {
			//let newChat = chats;
			//newChat.push(message);
			setChats(prevChat =>{ return [...prevChat,  message+"\n"]});
			console.log("message recived: ");
		  	console.log(message);
			console.log(chats);
		}
		socket?.on('message', messageListener);
	},[socket]);

	return(
		<div>
			<p>MESSAGES:</p>
			{chats.map(msg => (<p>{msg}</p>))}
		</div>
	);
}
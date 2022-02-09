import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { CreationChannel } from "../../models/CreationChannel.interface";
import { Message } from "../../models/Message.interface";

interface Prop
{
	socket : Socket | undefined,
	userId : number
}

export function Test({socket, userId} : Prop) {
	const [otherUser, setOtherUser] = useState(0);
	const [ch, setCreationChannel] = useState<CreationChannel>();

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
		<div>
		<form onSubmit={handleSubmit} >
			<label>
				<input type="number" value={otherUser} onChange={e => setOtherUser(parseInt(e.target.value))}/>
			</label>
			<input type="submit" value="Bind" />
		</form>
	</div>
	);
}


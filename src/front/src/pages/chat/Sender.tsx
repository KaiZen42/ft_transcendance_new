import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { io, Socket } from "socket.io-client";
import { Message } from "../../models/Message.interface";

interface Prop
{
	socket : Socket | undefined,
	packet : Message,
	room: string,
}

export function Sender({socket, packet, room} : Prop) {
	const [msg, setMessage] = useState('');
	
	const handleSubmit = (event: any) => {
		event.preventDefault();
		if(packet !== undefined && msg !== "")
		{
			packet.data = msg;
			packet.room = room;
			socket?.emit('channelMessage', packet);
			console.log("SEND TO SERVER:" , room);
			console.log(msg);
		}
		else
		{
			packet === undefined ? console.log("NOT DEFINED PACKEGE") : null;
		}
		setMessage("");
	}
	
	return(<div>
	<form onSubmit={handleSubmit} >
		<label>
			<input type="text" value={msg} onChange={e => setMessage(e.target.value)}/>
		</label>
		<input type="submit" value="Send" />
	</form>
	</div>)
}


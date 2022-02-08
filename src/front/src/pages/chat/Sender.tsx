import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { Message } from "../../models/Message.interface";

interface Prop
{
	socket : Socket | undefined,
	packet : Message
}

export function Sender({socket, packet} : Prop) {
	const [msg, setMessage] = useState('');
	
	const handleSubmit = (event: any) => {
		event.preventDefault();
		if(packet !== undefined && msg !== "")
		{
			packet.data = msg;

			socket?.emit('message', packet);
			console.log("SEND TO SERVER:" , );
		}
		else
		{
			//packet === undefined ? console.log("NOT DEFINED PACKEGE") : null;
		}
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


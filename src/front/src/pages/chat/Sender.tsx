import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { io, Socket } from "socket.io-client";
import { MessagePkg } from "../../models/Chat.interface";

interface Prop
{
	socket : Socket | undefined,
	packet : MessagePkg,
	room: string,
}

export function Sender({socket, packet, room} : Prop) {
	const [msg, setMessage] = useState('');
	
	
	function handleSubmit(event: any){
		event.preventDefault();
		console.log("MESASGE", msg);
		if(packet !== undefined 
			&& msg !== "" 
			&& msg  !== undefined)
		{
			packet.data = msg;
			packet.room = room;
			socket?.emit('channelMessage', packet);
			console.log("SEND TO SERVER:" , room);
			console.log(msg);
		}
		setMessage("");
	}
	
	return(
			<div className="card-footer">
				<div className="input-group"  >
					{/* <div className="input-group-append">
						<span className="input-group-text attach_btn">
							<i className="fas fa-paperclip"></i>
						</span>
					</div> */}
					<input 
						name="mex"
						className="form-control type_msg"
						placeholder="Type your message..."
						onChange={e => setMessage(e.target.value)}
					/>
					<div className="input-group-append">
						<span className="input-group-text send_btn">
							<i className="fas fa-location-arrow" onClick={handleSubmit}></i>
						</span>
					</div>
				</div>
			</div>

	)
}



{/* <div>
<form onSubmit={handleSubmit} >
	<label>
		<input type="text" value={msg} onChange={e => setMessage(e.target.value)}/>
	</label>
	<input type="submit" value="Send" />
</form>
</div> */}
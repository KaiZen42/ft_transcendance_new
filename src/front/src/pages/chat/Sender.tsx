import e from "express";
import React, { useState, useEffect, useRef, useContext  } from "react";
import socketIOClient, { io, Socket } from "socket.io-client";
import { Context } from "../../App";
import { MessagePkg } from "../../models/Chat.interface";

interface Prop
{
	packet : MessagePkg,
	room: string,
}

export function Sender({ packet, room} : Prop) {
	const [msg, setMessage] = useState('');
	
	const socket = useContext(Context).socket
	function handleSubmit(event: any){
		event.preventDefault();
		if(packet !== undefined 
			&& msg !== "" 
			&& msg  !== undefined)
		{
			packet.data = msg;
			packet.room = room;
			socket?.emit('channelMessage', packet);
		}
		setMessage("");
	}

	function enterSubmit(e: any)
	{
		if(e.code === "Enter")
		{
			handleSubmit(e);
		}
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
						onChange={e => e.target.value.length < 300 ? setMessage(e.target.value) : null}
						onKeyDown={enterSubmit}
						value={msg}
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
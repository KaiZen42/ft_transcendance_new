import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import MessageBox from "./MessageBox";
import { User } from "../../models/User.interface";
import axios from "axios";
import { Message, PrivateInvite } from "../../models/Message.interface";
import { response } from "express";
import { CreationChannel } from "../../models/CreationChannel.interface";
import { Test } from "./test";
const WS_SERVER =`http://${process.env.REACT_APP_BASE_IP}:3000/chat`;


/* export class inviteDto {

	@IsNotEmpty()
	idUser: number;
	@IsNotEmpty()
	room : string;
} */

export function Chat(/* {user} : Prop */) {

	const [pkg, setPkg] = useState<Message>();
	const [socket, setSocket] = useState<Socket>();
	const [roomState, setRoom] = useState("");
	

	function getUser()
	{
		  fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => { 
					setPkg({
						idUser : result.id,
						room : "",
						user : result.username,
						data : "",
					});});
			console.log("ESPLOSOOOO");
			console.log(pkg);
	};

	useEffect(
		() =>{
			if (pkg === undefined)
				getUser();
			const sock = io(WS_SERVER);
			setSocket(sock);
			sock.on("connect", () => 
			{
				console.log('connected')
			});
			/* sock.on("createRoom", (room: PrivateInvite) => 
			{
				console.log('channel created:');
				console.log(room);
				setRoom(room.room);
			}); */
			sock.on("createdRoom", (prvRoom: PrivateInvite) => 
			{
				console.log('Recived invite:');
				console.log(prvRoom);
				console.log(pkg);
				setRoom(prvRoom.room);
				if (pkg !== undefined && pkg?.idUser === prvRoom.idUser)
				{
					console.log('joing');
					sock.emit("joinRoom", prvRoom);
				}
			});
			return () => {sock.close()};
		} ,[pkg]);

	

	return (
		socket === undefined ?  (<Wrapper> <div>Not Connected</div> </Wrapper>)
		: (
			<Wrapper>
			{pkg === undefined ? (null) : <Test socket={socket} userId={pkg.idUser}/>}
			{pkg === undefined ? (null) : <MessageBox socket={socket} room={roomState}/>}
			{pkg === undefined ? (null) : <Sender socket={socket} packet={pkg} room={roomState}/>}
			</Wrapper>
		)
	);
}

export default Chat;

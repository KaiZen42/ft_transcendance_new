import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Sender } from './Sender';
import Wrapper from '../../components/Wrapper';
import MessageBox from './MessageBox';
import { User } from '../../models/User.interface';
import axios from 'axios';
import {
MessageInfoPkg,
MessagePkg,
OpenRoomPkg,
} from '../../models/Chat.interface';
import { response } from 'express';
import { UserList } from './UserList';
import { Box, grid } from '@mui/system';
import { Grid } from '@mui/material';
import './testChat.css';
import { ChannelList } from './ChannelList';
import MessageHeader from './MessageHeader';
const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

/* export class inviteDto {

	@IsNotEmpty()
	userId: number;
	@IsNotEmpty()
	room : string;
} */

export function Chat(/* {user} : Prop */) {
const [pkg, setPkg] = useState<MessagePkg>();
const [socket, setSocket] = useState<Socket>();
const [roomState, setRoom] = useState('');

function getUser() {
	fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
	credentials: 'include',
	})
	.then((response) => response.json())
	.then((result) => {
		setPkg({
		data: '',
		userId: {
			id: result.id,
			username: result.username,
		},
		room: '',
		sendData: 0,
		});
	});
	console.log('ESPLOSOOOO');
	console.log(pkg);
}

useEffect(() => {
	if (pkg === undefined) getUser();
	const sock = io(WS_SERVER);
	setSocket(sock);
	sock.on('connect', () => {
	console.log('connected');
	});
	/* sock.on("createRoom", (room: PrivateInvite) => 
			{
				console.log('channel created:');
				console.log(room);
				setRoom(room.room);
			}); */
	sock.on('viewedRoom', (roomView: string) => {
	setRoom(roomView);
	console.log('CURRENT ROOM: ', roomView);
	});
	sock.on('createRoom', (newRoom: string) => {
			console.log('Created a room:');
			console.log(newRoom);
			console.log(pkg);
			setRoom(newRoom);
		});
	return () => {
		sock.close();
	};
}, [pkg]);

return (
	// socket === undefined ?  (<Wrapper> <div>Not Connected</div> </Wrapper>)
	// : (
	// 	<Wrapper>
	// 		<Box display="flex" flexDirection="row">
	// 			<Box width="100%">
	// 				{pkg === undefined ? (null) : <MessageBox socket={socket} room={roomState}/>}
	// 				{pkg === undefined ? (null) : <Sender socket={socket} packet={pkg} room={roomState}/>}
	// 			</Box>
	// 			<Box sx={{ minWidth : "fit-content" }}>
	// 				{pkg === undefined ? (null) : <UserList socket={socket} userId={pkg.userId.id}/>}
	// 			</Box>
	// 			<Box sx={{ minWidth : "fit-content" }}>
	// 				{pkg === undefined ? (null) : <ChannelList socket={socket} userId={pkg.userId.id} room={roomState}/>}
	// 			</Box>
	// 		</Box>
	// 	</Wrapper>
	// )

	<Wrapper>
	<div className="container--fluid">
		{console.log("CHAT INFO", pkg)}
		<div className="row h-100">
		{pkg === undefined ? null : (
			<UserList socket={socket} userId={pkg.userId.id} />
		)}
		{pkg === undefined ? (null) : <ChannelList socket={socket} userId={pkg.userId.id} room={roomState}/>}
		<div className="col-md-4 col-xl-6 chat">
			<div className="card-body msg_card_body">
				<MessageHeader room={roomState}/>
				{pkg === undefined ? (null) : <MessageBox socket={socket} room={roomState} userId={pkg.userId.id}/>}
				<div className="card-footer">
					<div className="input-group">
					<div className="input-group-append">
						<span className="input-group-text attach_btn">
						<i className="fas fa-paperclip"></i>
						</span>
					</div>
					<textarea
						name=""
						className="form-control type_msg"
						placeholder="Type your message..."
					></textarea>
					<div className="input-group-append">
						<span className="input-group-text send_btn">
						<i className="fas fa-location-arrow"></i>
						</span>
					</div>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
	</Wrapper>
);
}

export default Chat;

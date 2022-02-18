import { RestorePageOutlined } from '@mui/icons-material';
import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	TextField,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import {
	ChannelInfo,
	MessageInfoPkg,
	OpenRoomPkg,
} from '../../models/Chat.interface';
import { User } from '../../models/User.interface';

interface Prop {
	socket: Socket | undefined;
	userId: number;
	room: string;
	clicked: boolean;
	setClicked: Function;
}

export function ChannelList({ socket, userId, room, clicked, setClicked }: Prop) {
	const [channels, setChannel] = useState<ChannelInfo[]>([]);
	//const [openRoomPkg, setOpenPkg] = useState();

	const selectChannel = (event: any, id: number) => {
		const viewRoom: OpenRoomPkg = {
			idUser: userId,
			room: '' + id,
		};
		socket?.emit('viewRoom', viewRoom);
		console.log('Clicked ', viewRoom);
	};

	useEffect(() => {
		socket?.on('notification', (msgInfo: MessageInfoPkg) => {
			if (room !== msgInfo.room) {
				let ch = channels.find((chan) => {
					return chan.name == msgInfo.room;
				});
				if (ch !== undefined) ch.notification++;
			}
		});

		return () => {
			socket?.removeListener('notification');
		};
	}, []);

	useEffect(() => {
	if (!clicked && channels.length) return;
		async function getter() {
			await fetch(
				`http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/ChannelsInfo/${userId}`,
				{ credentials: 'include' })
					.then((response) => response.json())
					.then((result) => {
						result.map((chan: ChannelInfo) => 
						{
							const opnePkj: OpenRoomPkg = {
								idUser: userId,
								room: chan.id.toString(),
								};
							socket?.emit('openRoom', opnePkj);
						});
				 	setChannel(result);
				});
			}
			getter();

	setClicked(false);
	
		console.log('PRIMA:   ', clicked);
		// clicked = false;
		// console.log('DOPO:   ', clicked);
	}, [socket, clicked]);

	function selectUser(info: ChannelInfo)
	{
		return ( info.partecipants[0].id === userId ? info.partecipants[1].userId : info.partecipants[0].userId )
	}

	return (
		<div className="col-md-4 col-xl-3 chat">
			<div className="card mb-sm-3 mb-md-0 contacts_card">
				<div className="card-header">
					<div className="user_info">
						<span>Open Chats</span>
					</div>
				</div>
				<div className="card-body contacts_body">
					<ul className="contacts">
						{console.log("rooms: ", channels)}
						
						{channels.map((chan: ChannelInfo) => {
							if (chan.notification === undefined) chan.notification = 0;
							return (
								<li className="active" key={chan.id}>
									{/* TODO: aggiungere stato effettivo */}
									<div className="d-flex bd-highlight">
										{console.log("avatar",selectUser(chan))}
										{chan.isPrivate ? <div className="img_cont">
											<img
												src={selectUser(chan).avatar}
												className="rounded-circle user_img"
											/>
											<span className="online_icon"></span>
										</div> : null}
										<div className="user_info">
											<span>{chan.isPrivate ? selectUser(chan).username : chan?.name}</span>
											<p>{chan?.name}</p>
											{/* TODO: aggiungere stato effettivo */}
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="card-footer"></div>
			</div>
		</div>
	);
}

import { Box, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { ChannelInfo , MessageInfoPkg, OpenRoomPkg} from "../../models/Chat.interface";

interface Prop
{
	socket : Socket | undefined,
	userId : number,
	room : string
}

export function ChannelList({socket, userId, room} : Prop) {

	const [channels, setChannel] = useState<ChannelInfo[]>([])
	//const [openRoomPkg, setOpenPkg] = useState();

	const selectChannel = (event: any, id: number) => {
		const viewRoom : OpenRoomPkg= {
			idUser: userId,
			room : "" + id
		}
		socket?.emit("viewRoom", viewRoom)
		console.log("Clicked ", viewRoom)
	}

	useEffect(() =>{
		fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/chat/channles/${userId}`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => setChannel(result));
		console.log("CHANNELS: ", channels);

		socket?.on("notification", (msgInfo: MessageInfoPkg) => {
			if (room !== msgInfo.room)
			{
				let ch = channels.find( (chan) => {return (chan.name == msgInfo.room)} )
				if (ch !== undefined)
					ch.notification++;
			}
		});
	},[socket]);
	return(
		<div>
			<Box sx={{ p: 1, border: 1 }} >
			<List dense sx={{ width: '100%',minWidth: 100, maxWidth: 200, bgcolor: 'background.paper' }}>
				{channels.map( (chan: ChannelInfo) => {
					//joinPkg : SimpleJoinPkg =  { idUser: userId; room: toString(chan.id)}
					const opnePkj : OpenRoomPkg = { idUser: userId, room: chan.id.toString()};
					if (chan.notification === undefined)
						chan.notification = 0;
					socket?.emit("openRoom", opnePkj);
					return (
					<ListItem key={chan.id} onClick={e => selectChannel(e, chan.id)}>
					<ListItemButton>
							<ListItemText id="outlined-basic" primary={`${chan.isPrivate? "P" : ""} ${chan.name}`} />
					</ListItemButton>
				</ListItem>
				);})}
			</List>
			</Box>
		</div>
	);

}

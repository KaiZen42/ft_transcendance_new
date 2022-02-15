import { Box, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { ChannelInfo } from "../../models/Chat.interface";

interface Prop
{
	socket : Socket | undefined,
	userId : number
}

export function ChannelList({socket, userId} : Prop) {

	const [channels, setChannel] = useState<ChannelInfo[]>([])
	const [joinPkg, setJoinPkg] = useState(-1);

	const selectChannel = (event: any, id: number) => {
		//setChannel
		console.log("Clicked ", id)

	}

	useEffect(() =>{
		fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/chat/channles/${userId}`, {credentials: 'include'})
			.then(response => response.json())
			.then(result => setChannel(result));
		console.log("CHANNELS: ", channels);
	},[socket]);

	return(
		<div>
			<Box sx={{ p: 1, border: 1 }} >
			<List dense sx={{ width: '100%',minWidth: 100, maxWidth: 200, bgcolor: 'background.paper' }}>
				{channels.map( (chan: ChannelInfo) => {return (
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

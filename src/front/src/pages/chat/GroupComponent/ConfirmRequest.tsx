import { Avatar, Checkbox, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { channelRequestPkj, CreationChannelPkg, FullPartecipant, Partecipant } from '../../../models/Chat.interface';
import { User } from '../../../models/User.interface';
import StyledBadge from '../../../styles/StyleBage';
import { Context } from '../../../App';
import { NavLink } from 'react-router-dom';
import { UserList } from '../UserList';

interface Prop{
	req: channelRequestPkj | undefined,
	setReq: Function
}

export default function ConfirmRequest({req, setReq}: Prop)
{
	const cont = useContext(Context)
	
	function confirm()
	{
		switch(req?.type)
		{
			case "kick":
					console.log("kicked")
					cont.socket?.emit("kick", req)
				break;

			case "ban":
					console.log("Ban")
					cont.socket?.emit("ban", req)
				break;

			case "up":
					console.log("Up")
					cont.socket?.emit("up", req)
				break;

			case "down":
					console.log("down")
					cont.socket?.emit("down", req)	
				break;

			case "mute":
					console.log("mute")
					cont.socket?.emit("mute", req)
				break;
		}
		
	}

	function decline()
	{

	}

	return(
		<div
		className="card-footer"
		style={{
			visibility: 'visible',
			opacity: '1',
		}}>
			<div className="group-search mb-sm-3 mb-md-0 contacts_card " >
			</div>
		</div>
	);
}
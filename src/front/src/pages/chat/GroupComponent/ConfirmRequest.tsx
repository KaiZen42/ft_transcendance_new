import { Avatar, Checkbox, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { channelRequestPkj, CreationChannelPkg, FullPartecipant, Partecipant } from '../../../models/Chat.interface';
import { User } from '../../../models/User.interface';
import StyledBadge from '../../../styles/StyleBage';
import { Context } from '../../../App';
import { NavLink } from 'react-router-dom';
import { UserList } from '../UserList';
import e from 'express';

interface Prop{
	req: channelRequestPkj | undefined,
	setReq: Function
}

export default function ConfirmRequest({req, setReq}: Prop)
{
	const [time,setTime] = useState(0);

	const cont = useContext(Context)
	
	function confirm()
	{
		if (req!== undefined && req.type === "mute")
		{
			if (time === 0) 
			{
				setReq(undefined);
				return;
			}
			req.time = time;
		}	
		cont.socket?.emit("ChannelRequest", req)
		setReq(undefined);
	}

	function keyDown(e: any)
	{
		if (e.key !== 'Enter') return
		confirm();
	}

	function decline()
	{
		setReq(undefined);
	}

	useEffect(()=>
	{

	},[time])
	return(
		<div
		className="card-footer"
		style={{
			opacity: '1',
		}}>
			<div className="group-search mb-sm-3 mb-md-0 contacts_card "
				onKeyDown={keyDown}>
					<div className="card-header">
					<div className='glow'>Confirm to {req?.type} {req?.reciverName}
					{
						req?.type !== "mute" ? null :
						<div>
						<span> for </span>
						<input
							id="groupname"
							name="Change Group Name"
							type="number"
							className="form-control"
							onChange={(e) => 
								{ e.target.value.length > 3 ? setTime(time) : setTime(+e.target.value)} }
							value={time}
							defaultValue={1}
						/>
						</div>
					}
						
						

						</div>
						<div className="input-group">
							<div className="input-group-prepend">
								<span className="input-group-text decline_btn " onClick={(e) => decline()}>
									<i className="fas fa-times" ></i>
								</span>
								<span className="input-group-text accept_btn " onClick={(e) => confirm()}>
									<i className="fas fa-check" ></i>
								</span>
								{/* <span className="input-group-text close_btn">
									<i
									className="fas fa-times fa-lg"
									onClick={(e) => setVisibility('hidden')}
									></i>
								</span> */}
							</div>
						</div>
					</div>
				</div>	
		</div>
	);
}
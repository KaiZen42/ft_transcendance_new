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
		cont.socket?.emit("ChannelRequest", req)
		setReq(undefined);
		
	}

	function decline()
	{
		setReq(undefined);
	}

	return(
		<div
		className="card-footer"
		style={{
			opacity: '1',
		}}>
			<div className="group-search mb-sm-3 mb-md-0 contacts_card "
				onKeyDown={confirm}>
					<div className="card-header">
						<div className='glow'>Confirm to {req?.type} {req?.reciverName}</div>
						<div className="input-group">
							<div className="input-group-prepend">
								<span className="input-group-text decline_btn ">
									<i className="fas fa-times" onClick={(e) => decline()}></i>
								</span>
								<span className="input-group-text accept_btn " >
									<i className="fas fa-check" onClick={(e) => confirm()}></i>
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
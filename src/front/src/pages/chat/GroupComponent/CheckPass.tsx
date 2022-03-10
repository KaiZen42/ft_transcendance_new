  import React, { useState, useEffect, useRef, useContext } from 'react';
  import socketIOClient, { Socket } from 'socket.io-client';
import { Context } from '../../../App';
import { JoinChannelPkg } from '../../../models/Chat.interface';

  	interface Prop
	{
	setVisibility: Function
	isVisible: string,
	errorVisibility: string,
	request: JoinChannelPkg

}

	export default function CheckPass({ isVisible, setVisibility, errorVisibility, request} : Prop)
	{
		const [pass, setPass] = useState("");
		const socket = useContext(Context).socket
		function enterSubmit(e: any)
		{
			if(e.code === "Enter")
			{
				request.key=pass
				socket?.emit('joinRoom', request);
			}
		}
		useEffect(()=>
		{
			
		},[])

		return(
			
			<div
				className="card-footer"
				style={{
					visibility: isVisible === 'hidden' ? 'hidden' : 'visible',
					opacity: '1',
				}}>
				<div className="group-search mb-sm-3 mb-md-0 contacts_card "
				onKeyDown={enterSubmit}>
					<div className="card-header">
						<div className='glow'>Insert password</div>
						<div className="input-group">
							<input
							type="text"
							placeholder="Password..."
							name=""
							value={pass}
							className="form-control search"
							onChange={e => setPass(e.target.value)}
							/>
							<div className="input-group-prepend">
								<span className="input-group-text search_btn ">
									<i className="fas fa-key"></i>
								</span>
								<span className="input-group-text close_btn">
									<i
									className="fas fa-times fa-lg"
									onClick={(e) => setVisibility('hidden')}
									></i>
								</span>
							</div>
						</div>
						{/* TODO: MAKE IT RED */}
						<div className='glow'
						hidden={errorVisibility === "hidden"}
						>Wrong Password</div>
					</div>
				</div>	
			</div>
		);
	}
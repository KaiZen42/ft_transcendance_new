import {
	Avatar,
	Stack,
  } from '@mui/material';
  import { useState, useEffect, useContext } from 'react';
  import { JoinChannelPkg, ShortChannel } from '../../../models/Chat.interface';
  import CheckPass from './CheckPass';
  import { Context } from '../../../App';

  export default function GroupInfo()
  {
	const userId = useContext(Context).userId;
	const socket = useContext(Context).socket;
	
	return(
		<div
      style={{
		
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: '1',
      }}
      className="overlay container-fluid row justify-content-center"
    >
      <div className="col-ms-10">
      <div className="group-search mb-sm-3 mb-md-0 contacts_card ">
        <div className="card-header">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search..."
              name=""
              className="form-control search"
              onChange={nameSubmit}
            />
            <div className="input-group-prepend">
              <span className="input-group-text search_btn">
                <i className="fas fa-search"></i>
              </span>
              <span className="input-group-text close_btn">
                <i
                  className="fas fa-times fa-lg"
                  onClick={(e) => setVisibility('hidden')}
                ></i>
              </span>
            </div>
          </div>
        </div>
        <div className="card-body contacts_body">
          {channels.map((chan: ShortChannel, i) => {
            return (
              <li key={chan.id}>
                <Stack direction="row" spacing={2}>
                  <Avatar alt="Img" src={'./group_icon.png'} />
                </Stack>
                <ul
                  className="group-contacts scrollable-search"
                  id="horizontal-list"
                >
                  <div
                    className="d-flex bd-highlight"
                    onClick={(e) => selectChannel(e, chan)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="user_info">
                      <span>{chan.name}</span>
                      <p>{chan.id}</p>
                      <p>{chan.mode}</p>
                    </div>
                  </div>
                </ul>
              </li>
            );
          })}
        </div>
        </div>
        </div>
        <div className="col-sm-5">
          {passVisibility === "hidden"? null :
            <CheckPass  
            isVisible={passVisibility} 
            setVisibility={setPassVisibility} 
            errorVisibility={errorVisibility}
            request={joinReq}
            />
          }
        </div>
    </div>
	)
  }
import {
  Avatar,
  Button,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { Box } from '@mui/system';
import React, { useState, useEffect, useRef } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { CreationChannelPkg, JoinChannelPkg, OpenRoomPkg, ShortChannel } from '../../../models/Chat.interface';
import { User } from '../../../models/User.interface';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import StyledBadge from '../../../styles/StyleBage';
import zIndex from '@mui/material/styles/zIndex';
import CheckPass from './CheckPass';
import { Visibility } from '@mui/icons-material';

interface Prop {
  socket: Socket | undefined;
  userId: number;
  isVisible: string;
  setVisibility: Function;
}

export function JoinGroup({
  socket,
  userId,
  isVisible = 'hidden',
  setVisibility,
}: Prop) {
  const [channels, setChannels] = useState<ShortChannel[]>([]);
  const [passVisibility, setPassVisibility]= useState("hidden")
  const [errorVisibility, setErrorVisibility] = useState("hidden");
  const [joinReq, setReq] = useState<JoinChannelPkg>({idUser: userId,
                                                      room: '',
                                                      key: "",
                                                    })

  const nameSubmit = (event: any) => {
    if (event.target.value) {
      event.preventDefault();
      (async () => {
        const data = await fetch(
          `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/ChannelByName/${event.target.value}`,
          { credentials: 'include' }
        );
        const result = data.json();
        result.then((res) => {
          setChannels(res);
        });
      })();
    } else {
      setChannels([]);
    }
  };

  function selectChannel(e: any, chan: ShortChannel) {
    setReq(pred => {
      pred.room = chan.id + "";
      return pred})
    if (chan.mode === "PRO")
      return  setPassVisibility("visible");
    socket?.emit('joinRoom', joinReq);
    setPassVisibility("hidden");
    setVisibility('hidden')
  }

  useEffect(() => {
    socket?.on("joinedStatus", (status) => {
        if (status)
        {
          setPassVisibility("hidden");
          setVisibility('hidden')
          console.log("join success");
        }
        else
        {
          setErrorVisibility("visible")
          console.log("Join Fail")
        }
    })
  }, []);

  return (
    <div
      style={{
        visibility: isVisible === 'hidden' ? 'hidden' : 'visible',
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
            socket={socket}
            request={joinReq}
            />
          }
        </div>
    </div>
  );
}

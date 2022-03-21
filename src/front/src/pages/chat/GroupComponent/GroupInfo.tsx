import { Avatar, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import {
  channelRequestPkj,
  ChatInfo,
  FullPartecipant,
  JoinChannelPkg,
  ShortChannel,
} from '../../../models/Chat.interface';
import CheckPass from './CheckPass';
import { Context } from '../../../App';
import { User } from '../../../models/User.interface';
import { PropaneSharp } from '@mui/icons-material';
import StyledBadge from '../../../styles/StyleBage';
import { stringify } from 'querystring';
import { NavLink } from 'react-router-dom';
import { Partecipant } from '../../../models/Chat.interface';
import UserGroup from './UserGroup';
import ConfirmRequest from './ConfirmRequest';

interface Prop {
  isVisible: boolean;
  setVisibility: Function;
  chatInfo: ChatInfo | undefined;
}

interface UpdateGroup {
  name: string;
  mode: string;
  pass: string;
}

export default function GroupInfo(Prop: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const onlines = useContext(Context).online;

  const [request, setRequest] = useState<channelRequestPkj | undefined>(
    undefined
  );
  const [partecipants, setPartecipants] = useState<FullPartecipant[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partecipantInfo, setPartecipantInfo] = useState<Partecipant>();
  const [editUsername, setEditUsername] = useState(false);
  const [msgCounter, setMsgCounter] = useState(0);
  const [updatedGroup, setUpdatedGroup] = useState<UpdateGroup>({
    name: '',
    mode: '',
    pass: '',
  });

  async function getUsersInChan() {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/getFullPartInfoNyChan/${Prop.chatInfo?.roomId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => setPartecipants(result));
  }

  async function getPartecipantInfo() {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/GetPartecipantByUserAndChan/${Prop.chatInfo?.roomId}/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        setPartecipantInfo(result);
      });
  }

  async function getMessageNumber() {
    await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/GetMessageCounter/${Prop.chatInfo?.roomId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        setMsgCounter(result);
      });
  }

  function handleKeyDown(e: any) {
    if (e.key === 'Escape') {
      Prop.setVisibility(false);
    }
  }

  useEffect(() => {
    getPartecipantInfo();
    getMessageNumber();
    if (partecipants.length < 1)
      getUsersInChan();
    console.log("RENDER PARTE")
    

    
  }, [Prop, request]);

  useEffect(()=>
  {
    socket?.on("ChannelRequest", ()=>
    {
      console.log("RELOAD PARTE")
      getUsersInChan();
    })
    return () => {
      socket?.removeListener('ChannelRequest');
    };
  },[])

  return (
    <div
      style={{
        visibility: Prop.isVisible === true ? 'visible' : 'hidden',
        opacity: '1',
      }}
      className="overlay container-fluid row justify-content-center"
      tabIndex={1}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <div className="col-ms-10">
        <div className="mb-sm-3 mb-md-0 contacts_card group-info">
          <div className="card-header">
            <span className="close_btn">
              <i
                className="fas fa-times fa-lg"
                onClick={(e) => Prop.setVisibility(!Prop.isVisible)}
              ></i>
            </span>
            <div className="card-body contacts_body row">
              <div className="group-info-box">
                <div className="info-username-image">
                  <img
                    alt="profile"
                    src={'./group_icon.png'}
                    className="profile-info-img"
                    style={{ marginTop: '10px' }}
                  />
                  <div className="profile-info-text username">
                    {Prop.chatInfo?.username}
                  </div>
                  <p className="profile-info-text">
                    MODE:{' '}
                    {Prop.chatInfo?.mode === 'PUB'
                      ? ' Public Group'
                      : Prop.chatInfo?.mode === 'PRI'
                      ? ' Private Group'
                      : ' Protected Group'}
                  </p>
                  <p className="profile-info-text">
                    Messages: {msgCounter + ' messages'}
                  </p>
                  <p className="profile-info-text">
                    Partecipants: {partecipants.length}{' '}
                    {partecipants.length === 1 ? ' User' : ' Users'}
                  </p>
                  <p className="profile-info-text">Group Type: </p>
                </div>
              </div>
              <div className="group-info-box">
                <div className="info-username-image">
                  <p className="profile-info-text username">Partecipants</p>
                  <div className="card-body contacts_body">
                    <ul className="contacts scrollable-search">
                      {partecipants === undefined ||
                      partecipantInfo === undefined
                        ? null
                        : partecipants.map((part: FullPartecipant) => {
                            const on = onlines.find(
                              (el) =>
                                part.userId.id === el || part.userId.id === -el
                            );
                            return partecipantInfo === undefined ? null : (
                              <li key={part.userId.id}>
                                <UserGroup
                                  part={part}
                                  on={on}
                                  myInfo={partecipantInfo!}
                                  setRequest={setRequest}
                                ></UserGroup>
                                )
                              </li>
                            );
                          })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {request === undefined ? null : (
        <ConfirmRequest req={request} setReq={setRequest} />
      )}
    </div>
  );
}

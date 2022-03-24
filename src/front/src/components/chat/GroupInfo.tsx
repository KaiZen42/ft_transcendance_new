import { useState, useEffect, useContext } from 'react';
import { Context } from '../../App';
import {
  channelRequestPkj,
  ChatInfo,
  FullPartecipant,
  Partecipant,
} from '../../models/Chat.interface';
import UserGroup from './UserGroup';
import groupIcon from '../../assets/group_icon.jpeg';

interface Prop {
  isVisible: boolean;
  setVisibility: Function;
  chatInfo: ChatInfo | undefined;
}

export default function GroupInfo(Prop: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const onlines = useContext(Context).online;

  const [request, setRequest] = useState<channelRequestPkj | undefined>(
    undefined
  );
  const [partecipants, setPartecipants] = useState<FullPartecipant[]>([]);
  const [partecipantInfo, setPartecipantInfo] = useState<Partecipant>();
  const [msgCounter, setMsgCounter] = useState(0);

  async function getUsersInChan() {
    await fetch(`/api/chat/getFullPartInfoNyChan/${Prop.chatInfo?.roomId}`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => setPartecipants(result));
  }

  async function getPartecipantInfo() {
    await fetch(
      `/api/chat/GetPartecipantByUserAndChan/${Prop.chatInfo?.roomId}/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        setPartecipantInfo(result);
      });
  }

  async function getMessageNumber() {
    await fetch(`/api/chat/GetMessageCounter/${Prop.chatInfo?.roomId}`, {
      credentials: 'include',
    })
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
    if (partecipants.length < 1) getUsersInChan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Prop]);

  useEffect(() => {
    socket?.on('ChannelRequest', () => {
      getUsersInChan();
    });
    return () => {
      socket?.removeListener('ChannelRequest');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="mb-sm-3 mb-md-0 contacts_card group-info" /* style={{minWidth: 'fit-content', maxWidth: 'fit-content'}} */>
          <div className="card-header">
            <span className="close_btn">
              <i
                className="fas fa-times fa-lg"
                onClick={(e) => Prop.setVisibility(!Prop.isVisible)}
              ></i>
            </span>
          </div>
          <div className="card-body contacts_body row scrollable">
            <div className="group-info-box">
              <div className="info-username-image">
                <img
                  alt="profile"
                  src={groupIcon}
                  className="profile-info-img"
                  style={{ marginTop: '10px' }}
                />
                <div
                  className="profile-info-text username"
                  style={{ display: 'flex' }}
                >
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
              </div>
            </div>
            <div className="group-info-box" /* style={{maxWidth:'fit-content', minWidth: 'fit-content'}} */>
              <div className="info-username-image">
                <p className="profile-info-text username">Partecipants</p>
                <div className="card-body contacts_body">
                  <ul className="contacts scrollable-search">
                    {partecipants === undefined || partecipantInfo === undefined
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
                                request={request}
                                setRequest={setRequest}
                              />
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
      {/* {request === undefined ? null : (
        <ConfirmRequest req={request} setReq={setRequest} />
      )} */}
    </div>
  );
}

import { Avatar, Checkbox, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import {
  channelRequestPkj,
  ChatInfo,
  JoinChannelPkg,
  ShortChannel,
  updateChannelPkj,
  ViewRoomPkg,
} from '../../../models/Chat.interface';
import CheckPass from './CheckPass';
import { Context } from '../../../App';
import { User } from '../../../models/User.interface';
import { PropaneSharp } from '@mui/icons-material';
import StyledBadge from '../../../styles/StyleBage';
import { stringify } from 'querystring';
import { NavLink } from 'react-router-dom';
import { Partecipant } from '../../../models/Chat.interface';
import GroupInfo from './GroupInfo';
import { userInfo } from 'os';
import { channel } from 'diagnostics_channel';

interface Prop {
  isVisible: boolean;
  setVisibility: Function;
  chatInfo: ChatInfo | undefined;
}

interface UpdateGroup {
  id: string | undefined;
  name: string | undefined;
  mode: string | undefined;
  pass: string | undefined;
}

export default function GroupSettings(Prop: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const onlines = useContext(Context).online;

  const [partecipants, setPartecipants] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partecipantInfo, setPartecipantInfo] = useState<Partecipant>();
  const [editUsername, setEditUsername] = useState(false);
  const [msgCounter, setMsgCounter] = useState(0);
  const [updatedGroup, setUpdatedGroup] = useState<UpdateGroup>({
    id: Prop.chatInfo?.roomId,
    name: Prop.chatInfo?.username,
    mode: Prop.chatInfo?.mode,
    pass: '',
  });
  const [privateChan, setPrivateChan] = useState(
    Prop.chatInfo?.mode === 'PRI' ? true : false
  );



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

  function setToPriv(priv: boolean) {
    setUpdatedGroup({ ...updatedGroup, pass: undefined, mode: priv ? 'PRI' : 'PUB' });
    setPrivateChan(priv);
  }
  function removePass(pub: boolean) {
    if (pub)
    {
      setUpdatedGroup({ ...updatedGroup, pass: '', mode: "PUB" });
      setPrivateChan(false);
    }
    else
      setUpdatedGroup({ ...updatedGroup, pass: undefined, mode: "PUB" });
  }

  function handleClose() {
    Prop.setVisibility(false);
  }

  const isChanged = (): boolean | undefined => {
    return !(
      updatedGroup?.name !== Prop.chatInfo?.username ||
      updatedGroup?.mode !== Prop.chatInfo?.mode ||
      updatedGroup?.pass !== ''
    );
  };

  async function submitChanges(e: any) {
    if (updatedGroup !== undefined 
      && partecipantInfo !== undefined 
      && Prop.chatInfo !== undefined
      && Prop.chatInfo.roomId !== undefined
      && partecipantInfo?.mod === 'o' || partecipantInfo?.mod === 'a')
      {
        const update: updateChannelPkj = {
          userId: userId,
          id: +Prop.chatInfo!.roomId,
          name: updatedGroup.name !== undefined ? updatedGroup.name : Prop.chatInfo!.roomId,
          mode: updatedGroup.mode !== undefined ? updatedGroup.mode : Prop.chatInfo!.mode,
          pass: updatedGroup.pass ,
        }
        socket?.emit("ChangeRoomSettings", update)
        handleClose();
      }
  }

  async function deleteGroup() {
    if (partecipantInfo?.mod === 'o')
    {
      console.log("DELETE CHAN")
      const req: ViewRoomPkg = {
        room: Prop.chatInfo!.roomId.toString(),
        idUser: userId
      }
      socket?.emit("DeleteChan", req)
    handleClose();
    }
  }

  function handleKeyDown(e: any) {
    if (partecipantInfo?.mod === 'a' || partecipantInfo?.mod === 'o') {
      if (e.key === 'Enter' && isChanged()) {
        submitChanges(e);
      }
      if (e.key === 'Escape') {
        Prop.setVisibility(false);
      }
    }
  }

  useEffect(() => {
    getPartecipantInfo();
  }, []);

  return (
    <div
      style={{
        visibility: Prop.isVisible === true ? 'visible' : 'hidden',
        opacity: '1',
      }}
      tabIndex={1}
      onKeyDown={(e) => handleKeyDown(e)}
      className="overlay container-fluid row justify-content-center"
    >
      <div className="col-ms-10">
        <div
          className="group-search mb-sm-3 mb-md-0 contacts_card"
          style={{
            width: '500px',
            height: '500px',
            position: 'absolute',
            marginLeft: '40%',
          }}
        >
          <div className="card-header">
            <span className="close_btn">
              <i
                className="fas fa-times fa-lg"
                onClick={(e) => Prop.setVisibility(!Prop.isVisible)}
              ></i>
            </span>
            <div className="card-body contacts_body row">
              <div
                className="group-info-box"
                style={{ width: '500px', height: '400px' }}
              >
                <p
                  className="profile-info-text username col-md-x"
                  style={{ textAlign: 'center' }}
                >
                  Group Settings
                </p>

                  <div className="row justify-content-center justify-content-center">
                    <p className="profile-info-text">
                      Group Name:{' '}
                      <input
                        id="groupname"
                        name="Change Group Name"
                        type="text"
                        className="form-control"
                        onChange={(e) =>
                          setUpdatedGroup({
                            ...updatedGroup,
                            name: e.target.value,
                          })
                        }
                        value={updatedGroup.name}
                      />
                    </p>
                  </div>
                  <p className="profile-info-text justify-content-center">
                    Password:
                  </p>
                  <div
                    className="profile-info-text"
                    style={{ display: 'flex' }}
                  >
                    <input
                      id="grouppass"
                      name="Change Group Pass"
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        setUpdatedGroup({
                          ...updatedGroup,
                          pass: e.target.value === "" ? undefined : "" + e.target.value ,
                          mode: e.target.value === "" ? "PUB" : "PRO",
                        })
                      }
                      value={!privateChan && updatedGroup.pass !== "" ?  
                              (updatedGroup.pass !== undefined ? updatedGroup.pass : "")
                              : '🚫Disabled🚫'}
                      disabled={privateChan || updatedGroup.pass === ""}
                    />
                    <Checkbox
                      checked={privateChan}
                      onChange={(e) => setToPriv(e.target.checked)}
                    />{' '}
                    Private
                    <Checkbox
                      checked={updatedGroup.pass === ""}
                      onChange={(e) => removePass(e.target.checked)}
                    />{' '}
                    NO Password
                  </div>
                  <div
                    className="row"
                    style={{ textAlign: 'center', marginTop: '20px' }}
                  >
                    <div className="col">
                      <button
                        className="btn btn-outline-success"
                        disabled={isChanged()}
                        onClick={submitChanges}
                      >
                        Apply
                      </button>
                    </div>
                    <div className="col">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  {partecipantInfo?.mod !== 'o'? null:
                  <div
                    className="col"
                    style={{ textAlign: 'center', marginTop: '-5px' }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={deleteGroup}
                    >
                      Delete Group 🚫
                    </button>
                  </div>
                  }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

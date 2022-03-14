import { Avatar, Checkbox, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import {
  ChatInfo,
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
import GroupInfo from './GroupInfo';

interface Prop {
  isVisible: boolean;
  setVisibility: Function;
  chatInfo: ChatInfo | undefined;
}

interface UpdateGroup {
  name: string | undefined;
  mode: string | undefined;
  pass: string;
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
    setUpdatedGroup({ ...updatedGroup, pass: '', mode: priv ? 'PRI' : 'PUB' });
    setPrivateChan(priv);
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

  async function submitChanges() {}

  useEffect(() => {
    getPartecipantInfo();
  }, []);

  return (
    <div
      style={{
        visibility: Prop.isVisible === true ? 'visible' : 'hidden',
        opacity: '1',
      }}
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
                <form onSubmit={() => submitChanges}>
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
                      name="ChangeGroupPass"
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        setUpdatedGroup({
                          ...updatedGroup,
                          pass: e.target.value,
                          mode: 'PRO',
                        })
                      }
                      value={
                        !privateChan ? 'Change/Add Password' : '🚫Disabled🚫'
                      }
                      disabled={privateChan}
                    />
                    <Checkbox
                      checked={privateChan}
                      onChange={(e) => setToPriv(e.target.checked)}
                    />{' '}
                    Private
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

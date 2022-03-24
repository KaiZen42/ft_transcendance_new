import { Checkbox } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import {
  ChatInfo,
  updateChannelPkj,
  ViewRoomPkg,
  Partecipant,
} from '../../models/Chat.interface';
import { Context } from '../../App';

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

  const [partecipantInfo, setPartecipantInfo] = useState<Partecipant>();
  const [updatedGroup, setUpdatedGroup] = useState<UpdateGroup>({
    id: Prop.chatInfo?.roomId,
    name: Prop.chatInfo?.username,
    mode: Prop.chatInfo?.mode,
    pass: '',
  });
  const [privateChan, setPrivateChan] = useState(
    Prop.chatInfo?.mode === 'PRI' ? true : false
  );

  function setToPriv(priv: boolean) {
    setUpdatedGroup({
      ...updatedGroup,
      pass: undefined,
      mode: priv ? 'PRI' : 'PUB',
    });
    setPrivateChan(priv);
  }
  function removePass(pub: boolean) {
    if (pub) {
      setUpdatedGroup({ ...updatedGroup, pass: '', mode: 'PUB' });
      setPrivateChan(false);
    } else setUpdatedGroup({ ...updatedGroup, pass: undefined, mode: 'PUB' });
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
    if (
      (updatedGroup !== undefined &&
        partecipantInfo !== undefined &&
        Prop.chatInfo !== undefined &&
        Prop.chatInfo.roomId !== undefined &&
        partecipantInfo?.mod === 'o') ||
      partecipantInfo?.mod === 'a'
    ) {
      const update: updateChannelPkj = {
        userId: userId,
        id: +Prop.chatInfo!.roomId,
        name:
          updatedGroup.name !== undefined
            ? updatedGroup.name
            : Prop.chatInfo!.roomId,
        mode:
          updatedGroup.mode !== undefined
            ? updatedGroup.mode
            : Prop.chatInfo!.mode,
        pass: updatedGroup.pass,
      };
      socket?.emit('ChangeRoomSettings', update);
      handleClose();
    }
  }

  async function deleteGroup() {
    if (partecipantInfo?.mod === 'o') {
      const req: ViewRoomPkg = {
        room: Prop.chatInfo!.roomId.toString(),
        idUser: userId,
      };
      socket?.emit('DeleteChan', req);
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
    fetch(
      `/api/chat/GetPartecipantByUserAndChan/${Prop.chatInfo?.roomId}/${userId}`,
      { credentials: 'include' }
    )
      .then((response) => response.json())
      .then((result) => {
        setPartecipantInfo(result);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                      onChange={(e) => {
                        if (/^[a-zA-Z0-9-_]{0,20}$/.test(e.target.value)) {
                          setUpdatedGroup({
                            ...updatedGroup,
                            name: e.target.value,
                          });
                        }
                      }}
                      value={updatedGroup.name}
                    />
                  </p>
                </div>
                <p className="profile-info-text justify-content-center">
                  Password:
                </p>
                <div className="profile-info-text" style={{ display: 'flex' }}>
                  <input
                    id="grouppass"
                    name="Change Group Pass"
                    type="text"
                    className="form-control"
                    onChange={(e) =>
                      setUpdatedGroup({
                        ...updatedGroup,
                        pass:
                          e.target.value === ''
                            ? undefined
                            : '' + e.target.value,
                        mode: e.target.value === '' ? 'PUB' : 'PRO',
                      })
                    }
                    value={
                      !privateChan && updatedGroup.pass !== ''
                        ? updatedGroup.pass !== undefined
                          ? updatedGroup.pass
                          : ''
                        : '🚫Disabled🚫'
                    }
                    disabled={privateChan || updatedGroup.pass === ''}
                  />
                  <Checkbox style={{color: 'white'}}
                    checked={privateChan}
                    onChange={(e) => setToPriv(e.target.checked)}
                  />{' '}
                  Private
                  <Checkbox style={{color: 'white'}}
                    checked={updatedGroup.pass === ''}
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
                {partecipantInfo?.mod !== 'o' ? null : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

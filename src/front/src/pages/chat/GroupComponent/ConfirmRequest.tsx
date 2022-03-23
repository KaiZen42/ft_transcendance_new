import { useState, useEffect, useContext } from 'react';
import { channelRequestPkj } from '../../../models/Chat.interface';
import { Context } from '../../../App';

interface Prop {
  req: channelRequestPkj | undefined;
  setReq: Function;
}

export default function ConfirmRequest({ req, setReq }: Prop) {
  const [time, setTime] = useState(1);

  const cont = useContext(Context);

  function confirm() {
    if (req !== undefined && req.type === 'mute') {
      if (time === 0) {
        setReq(undefined);
        return;
      }
      req.time = time;
    }
    cont.socket?.emit('ChannelRequest', req);
    setReq(undefined);
  }

  function keyDown(e: any) {
    if (e.key !== 'Enter') return;
    confirm();
  }

  function decline() {
    setReq(undefined);
  }

  useEffect(() => {}, [time]);
  return (
    <div
      className="card-footer"
      style={{
        opacity: '1',
      }}
    >
      <div
        className="group-search mb-sm-3 mb-md-0 contacts_card "
        onKeyDown={keyDown}
      >
        <div className="card-header">
          <div className="glow">
            Confirm to {req?.type} {req?.reciverName}
            {req?.type !== 'mute' ? null : (
              <div>
                <span> for </span>
                <input
                  id="groupname"
                  name="Change Group Name"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    if (e.target.value.length <= 3) setTime(+e.target.value);
                  }}
                  value={time}
                />
              </div>
            )}
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text decline_btn " onClick={decline}>
                <i className="fas fa-times"></i>
              </span>
              <span className="input-group-text accept_btn " onClick={confirm}>
                <i className="fas fa-check"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

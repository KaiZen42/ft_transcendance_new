import { useState, useEffect, useContext } from 'react';
import { Context } from '../../App';
import { channelRequestPkj } from '../../models/Chat.interface';

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

  function decline() {
    setReq(undefined);
  }

  useEffect(() => {}, [time]);
  return (
    <ul style={{ display: 'inline-block' }}>
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
      <li className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text decline_btn " onClick={decline}>
            <i className="fas fa-times"></i>
          </span>
          <span className="input-group-text accept_btn " onClick={confirm}>
            <i className="fas fa-check"></i>
          </span>
        </div>
      </li>
    </ul>
  );
}

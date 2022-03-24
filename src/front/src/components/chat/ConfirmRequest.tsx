import { width } from '@mui/system';
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

  function keyDown(e: any) {
    if (e.key !== 'Enter') return;
    confirm();
  }

  function decline() {
    setReq(undefined);
  }

  useEffect(() => {}, [time]);
  return (
    <div style={{ display: 'inline-block', fontSize: '10px' }}>
      <div className="glow" style={{textAlign: 'center'}}>
        Confirm to {req?.type} <br></br>
        {req?.reciverName}
        {req?.type !== 'mute' ? null : (
          <div>
            <span style={{display: 'flex'}}> for 
            <input
              id="groupname"
              name="Change Group Name"
              type="text"
              className="form-control"
              style={{width: '70px', height: '20px', fontSize: '15px', marginLeft: '10px'}}
              onChange={(e) => {
                if (e.target.value.length <= 3) setTime(+e.target.value);
              }}
              value={time}
            /></span>
          </div>
        )}
      </div>
      <li className="input-group" style={{ width: '10px', height: '10px' }}>
        <div className="input-group-prepend">
          <span className="input-group-text decline_btn " onClick={decline}>
            <i className="fas fa-times"></i>
          </span>
          <span
            className="input-group-text accept_btn "
            style={{ width: '35px' }}
            onClick={confirm}
          >
            <i className="fas fa-check"></i>
          </span>
        </div>
      </li>
    </div>
  );
}

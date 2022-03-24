import { useState, useEffect, useContext } from 'react';
import { Context } from '../../App';
import { JoinChannelPkg, ShortChannel } from '../../models/Chat.interface';

interface Prop {
  setVisibility: Function;
  isVisible: string;
  errorVisibility: string;
  request: JoinChannelPkg;
  banVisibility: string;
  setBanVisibility: Function;
  setErrorVisibility: Function;
  chan: ShortChannel | undefined;
}

export default function CheckPass({
  isVisible,
  setVisibility,
  errorVisibility,
  request,
  banVisibility,
  setBanVisibility,
  setErrorVisibility,
  chan,
}: Prop) {
  const [pass, setPass] = useState('');
  const socket = useContext(Context).socket;
  function enterSubmit(e: any) {
    if (e.code === 'Enter') {
      request.key = pass;
      socket?.emit('joinRoom', request);
    }
  }
  useEffect(() => {}, [banVisibility]);

  return (
    <div
      style={{
        visibility: isVisible === 'hidden' ? 'hidden' : 'visible',
        opacity: '1',
        marginLeft: '20%',
        marginTop: '50%',
        marginRight: '20%',
      }}
    >
      <div className="mb-sm-3 contacts_card" onKeyDown={enterSubmit}>
        <div className="check-pass-header pass-check">
          <span className="input-group-text close_btn">
            <i
              className="fas fa-times fa-lg"
              onClick={(e) => {
                setVisibility('hidden');
                setBanVisibility('hidden');
                setErrorVisibility('hidden');
              }}
            ></i>
          </span>
          <div className="contacts_body card-body scrollable-searchGroup">
            {chan?.mode !== 'PRO' ? null : (
              <>
                <div className="glow">Insert password</div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Password..."
                    name=""
                    value={pass}
                    className="form-control search"
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <div className="input-group-prepend">
                    <span className="input-group-text search_btn ">
                      <i className="fas fa-key"></i>
                    </span>
                  </div>
                </div>
              </>
            )}
            {banVisibility === 'visible' && errorVisibility === 'hidden' ? (
              <div className="glow" style={{ color: 'red' }}>
                YOU ARE BANNED
                {console.log(banVisibility, errorVisibility)}
              </div>
            ) : banVisibility === 'hidden' && errorVisibility === 'visible' ? (
              <div className="glow" style={{ color: 'red' }}>
                Wrong Password
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

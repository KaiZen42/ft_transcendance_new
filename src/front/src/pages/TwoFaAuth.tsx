import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import '../styles/TwoFaAuth.css';

export default function TwoFaAuth() {
  const [code, setCode] = useState('');
  const [invalidCode, setInvalidCode] = useState(false);
  const [authed, setAuthed] = useState<boolean | undefined>(undefined);

  const location = useLocation();
  const from: any = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    async function getAuth() {
      const res = await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (!data.two_fa) navigate(-1);
      // che figata
      else setAuthed(false);
    }
    getAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    const res = await axios.post(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/auth2fa`,
      {
        twoFaAuthCode: code,
      },
      { withCredentials: true }
    );
    if (!res.data) setInvalidCode(true);
    setAuthed(res.data);
  }

  function updateCode(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    const re = /^[0-9\b]{0,6}$/;
    if (re.test(value)) setCode(value);
    if (invalidCode) setInvalidCode(false);
  }

  return (
    <>
      {authed && <Navigate to={from.from.pathname} />}
      {authed === false && (
        <div className="box">
          <h2 className="code--title">TRASCENDANCE</h2>
          <p className="auth--title1">
            YOU HAVE 2 FACTOR AUTHENTICATION ENABLED
          </p>
          <p className="auth--title2">INSERT CODE FROM GOOGLE AUTHENTICATOR</p>
          <hr />
          <div className="row justify-content-center">
            <div className="col-4">
              <input
                placeholder="000000"
                className={`form-control p-2 code--input ${
                  invalidCode ? 'is-invalid' : ''
                }`}
                onChange={updateCode}
                value={code}
              />
              <div style={{ fontSize: '1rem' }} className="invalid-feedback">
                wrong code
              </div>
            </div>
            <div>
              <div className="row justify-content-center">
                <button
                  className="btn btn-secondary col-auto p-2"
                  style={{ marginTop: '10px' }}
                  onClick={handleSubmit}
                  disabled={code.length !== 6 ? true : false}
                >
                  Authenticate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

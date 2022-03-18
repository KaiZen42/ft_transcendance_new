import axios from 'axios';
import { ChangeEvent, createRef, FormEvent, useEffect, useState } from 'react';
import { User } from '../models/User.interface';
import '../styles/ProfilePopUp.css';

interface Props {
  show: boolean;
  user: User;
  onClose: () => void;
  updateState: (user: User) => void;
}

interface UpdateUser {
  id: number;
  avatar: string;
  username: string;
  two_fa_auth: boolean;
  file: React.RefObject<HTMLInputElement>;
  auth_code: string;
}

export default function ProfilePopUp({
  onClose,
  show,
  user,
  updateState,
}: Props) {
  const [valid, setValid] = useState({
    username: true,
    auth_code: true,
  });
  const [qrCode, setQrCode] = useState<string>('');
  const [editUsername, setEditUsername] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UpdateUser>({
    id: 0,
    avatar: '',
    username: '',
    two_fa_auth: false,
    file: createRef(),
    auth_code: '',
  });

  const closeHandler = () => {
    updatedUser.file.current!.value = '';
    setUpdatedUser({
      ...user,
      file: createRef(),
      auth_code: '',
    });
    setEditUsername(false);
    setQrCode('');
    onClose();
  };

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      avatar: url,
    }));
  }

  async function updateSwitch(e: ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;
    if (checked && !user.two_fa_auth) {
      const res = await axios.post(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/generate`,
        {
          id: updatedUser.id,
          avatar: updatedUser.avatar,
          username: updatedUser.username,
          two_fa_auth: updatedUser.two_fa_auth,
        },
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(res.data);
      setQrCode(url);
      setUpdatedUser((prevUser) => ({
        ...prevUser,
        auth_code: '',
      }));
    }
    if (!checked) setQrCode('');
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      two_fa_auth: checked,
    }));
  }

  useEffect(() => {
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      ...user,
    }));
  }, [user]);

  async function validateInput(): Promise<boolean> {
    if (updatedUser.username !== user.username) {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/username/${updatedUser.username}`
      );
      if (data.id) {
        setValid((prevValid) => ({
          ...prevValid,
          username: false,
        }));
        setEditUsername(true);
        return false;
      }
    }
    if (updatedUser.two_fa_auth && !user.two_fa_auth) {
      try {
        axios.post(
          `http://${process.env.REACT_APP_BASE_IP}:3001/api/turn2fa`,
          { twoFaAuthCode: updatedUser.auth_code },
          { withCredentials: true }
        );
      } catch (error) {
        setValid((prevValid) => ({
          ...prevValid,
          auth_code: false,
        }));
        return false;
      }
    }
    return true;
  }

  async function applyChanges(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!(await validateInput())) return;
    let upload_url;
    if (updatedUser.file.current!.files!.length > 0) {
      const formData = new FormData();
      formData.append('to_upload', updatedUser.file.current!.files![0]);
      upload_url = await axios.post(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/image`,
        formData,
        { withCredentials: true }
      );
    }
    updateState({
      id: updatedUser.id,
      avatar: upload_url ? upload_url.data.url : updatedUser.avatar,
      username: updatedUser.username,
      two_fa_auth: updatedUser.two_fa_auth,
    });
    updatedUser.file.current!.value = '';
    setQrCode('');
    onClose();
  }

  function inputChecker(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === 'auth_code') {
      if (!valid.auth_code)
        setValid((prevValid) => ({
          ...prevValid,
          auth_code: true,
        }));
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value))
        setUpdatedUser((prevUser) => ({
          ...prevUser,
          auth_code: value,
        }));
    }
    if (name === 'username') {
      if (!valid.username)
        setValid((prevValid) => ({
          ...prevValid,
          username: true,
        }));
      const re = /^[a-zA-Z0-9-_]{0,20}$/;
      if (re.test(value))
        setUpdatedUser((prevUser) => ({
          ...prevUser,
          username: value,
        }));
    }
  }

  const isChanged = (): boolean | undefined => {
    return !(
      updatedUser?.avatar !== user?.avatar ||
      updatedUser?.two_fa_auth !== user?.two_fa_auth ||
      updatedUser?.username !== user?.username
    );
  };

  return (
    <div
      style={{
        visibility: show ? 'visible' : 'hidden',
        opacity: show ? '1' : '0',
      }}
      className="overlay"
    >
      <div className="popup">
        <span className="close" onClick={closeHandler}>
          &times;
        </span>
        <div className="content">
          <img
            src={updatedUser?.avatar}
            className="popup--image"
            alt="user avatar"
          />
          <div className="image-upload">
            <label htmlFor="file-input">
              <i className="bi bi-cloud-arrow-up popup--icon" />
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              ref={updatedUser.file}
              onChange={onSelectFile}
            />
          </div>
          <form className="container" onSubmit={applyChanges}>
            <div className="row justify-content-center">
              <div className="col-4">
                <label htmlFor="username" className="text-right form-label">
                  username
                </label>
              </div>
              {editUsername ? (
                <>
                  <div className="col-4">
                    <div className="input-group has-validation">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className={`form-control ${
                          !valid.username ? 'is-invalid' : ''
                        }`}
                        style={{}}
                        onChange={(e) => inputChecker(e)}
                        value={updatedUser?.username}
                        required
                      />
                      <div
                        style={{ fontSize: '1rem' }}
                        className="invalid-feedback"
                      >
                        this username was taken
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                    {/^.{3,}$/.test(updatedUser?.username) &&
                      valid.username && (
                        <i
                          className="bi bi-check popup--form--icon"
                          style={{ fontSize: '2rem' }}
                          onClick={() => setEditUsername(false)}
                        />
                      )}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-auto">
                    <span className="form-text">{updatedUser?.username}</span>
                  </div>
                  <div className="col-2">
                    <i
                      className="bi bi-pencil popup--form--icon"
                      onClick={() => setEditUsername(true)}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="row justify-content-center">
              <div className="col-5">
                <span className="form-label">2FA authentication</span>
              </div>
              <div className="col-2">
                <div className="form-check form-switch form-check-inline">
                  <input
                    name="two_fa_auth"
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => updateSwitch(e)}
                    checked={updatedUser!.two_fa_auth}
                  />
                </div>
              </div>
            </div>
            {qrCode && (
              <>
                <div className="row">
                  <div className="col">
                    <img src={qrCode} alt="qr code" />
                  </div>
                </div>
                <div className="row" style={{ justifyContent: 'center' }}>
                  <div className="col-5">
                    <input
                      name="auth_code"
                      placeholder="000000"
                      style={{ textAlign: 'center' }}
                      className={`form-control ${
                        !valid.auth_code ? 'is-invalid' : ''
                      }`}
                      type="text"
                      onChange={(e) => inputChecker(e)}
                      value={updatedUser?.auth_code}
                    />
                    <div
                      style={{ fontSize: '1rem' }}
                      className="invalid-feedback"
                    >
                      wrong code
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-outline-success"
                  disabled={
                    isChanged() ||
                    editUsername ||
                    (updatedUser?.auth_code === '' && qrCode !== '') ||
                    !valid.auth_code
                  }
                >
                  Apply
                </button>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={closeHandler}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

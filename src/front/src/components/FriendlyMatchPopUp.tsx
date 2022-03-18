import { useNavigate } from 'react-router-dom';
import { User } from '../models/User.interface';

interface Friend {
  id: number;
  username: string;
}

export default function FriendlyMatchPopUp({
  friend,
  onClose,
  user,
}: {
  friend: Friend | undefined;
  onClose: () => void;
  user: User | undefined;
}) {
  const navigate = useNavigate();

  const acceptMatch = () => {
    navigate('/game', {
      state: {
        id: user?.id,
        username: user?.username,
        avatar: user?.avatar,
        requesting: false,
        idRequesting: friend?.id,
      },
    });
  };

  return (
    <div
      style={{
        visibility: typeof friend !== 'undefined' ? 'visible' : 'hidden',
        opacity: typeof friend !== 'undefined' ? '1' : '0',
        display: 'grid',
        placeItems: 'center',
      }}
      className="overlay"
    >
      <div className="friendly-match-popup">
        <h1>{friend?.username}</h1>
        <h3>invited you to a friendly match</h3>
        <div className="friendly-buttons">
          <button className="game-popup-btn btn-play" onClick={acceptMatch}>
            LET'S PONG
          </button>
          <button
            className="game-popup-btn btn-home"
            onClick={() => {
              onClose();
            }}
          >
            NOT NOW
          </button>
        </div>
      </div>
    </div>
  );
}

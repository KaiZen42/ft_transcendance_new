import axios from 'axios';
import { useEffect, useState } from 'react';

interface FriendRequest {
  id: number;
  requesting: {
    avatar: string;
    username: string;
  };
}

export default function FriendList({ userId }: { userId: number }) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/getRequests/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
      });
  }, [userId]);

  const acceptFriend = (id: number) => {
    axios.put(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/acceptRequest`,
      { id: id }
    );
  };

  const declineFriend = (id: number) => {
    axios.delete(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/unfriend`
    );
  };

  return (
    <>
      <div className="last-games-title">
        <h1
          className="profile-info-text username"
          style={{ marginBottom: '0' }}
        >
          friend list
        </h1>
      </div>
      <div className="friends-items">
        <div className="friend-requests">
          <h3>requests</h3>
          {requests.map((req) => (
            <div className="friend-item">
              <div style={{ paddingLeft: '1rem' }}>
                <img
                  src={req.requesting.avatar}
                  alt=""
                  className="profile-info-img sm"
                  style={{ marginRight: '1rem' }}
                />
                <p>{req.requesting.username}</p>
              </div>
              <div>
                <button
                  className="game-popup-btn btn-play"
                  onClick={() => acceptFriend(req.id)}
                >
                  accept
                </button>
                <button
                  className="game-popup-btn btn-home"
                  onClick={() => declineFriend(req.id)}
                >
                  decline
                </button>
              </div>
            </div>
          ))}
          <hr />
        </div>
        <div className="friends-accepted"></div>
      </div>
    </>
  );
}

import axios from 'axios';
import { useEffect, useState } from 'react';

interface FriendRequest {
  id: number;
  requesting: {
    avatar: string;
    username: string;
  };
}

interface FriendAccepted {
  id: number;
  requesting: {
    id: number;
    avatar: string;
    username: string;
  };
  receiving: {
    id: number;
    avatar: string;
    username: string;
  };
}

export default function FriendList({ userId }: { userId: number }) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<FriendRequest[]>([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!updated) return;
    setUpdated(false);
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/getRequests/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
      });
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/getFriends/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFriends(
          data.map((friend: FriendAccepted) => {
            if (friend.receiving.id === userId)
              return { id: friend.id, requesting: friend.requesting };
            else return { id: friend.id, requesting: friend.receiving };
          })
        );
      });
  }, [updated]);

  useEffect(() => {
    setUpdated(true);
  }, [userId]);

  const acceptFriend = (id: number) => {
    axios
      .put(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/acceptRequest`,
        { id: id }
      )
      .then(() => setUpdated(true));
  };

  const declineFriend = (id: number) => {
    axios
      .delete(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/unfriend`,
        {
          data: { id: id },
        }
      )
      .then(() => setUpdated(true));
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
          {requests.length ? (
            <>
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
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="friends-accepted">
          {friends.map((friend) => (
            <div className="friend-item">
              <div style={{ paddingLeft: '1rem' }}>
                <img
                  src={friend.requesting.avatar}
                  alt=""
                  className="profile-info-img sm"
                  style={{ marginRight: '1rem' }}
                />
                <p>{friend.requesting.username}</p>
              </div>
              <div>
                <button
                  className="game-popup-btn btn-home"
                  onClick={() => declineFriend(friend.id)}
                >
                  unfriend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

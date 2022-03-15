import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App';

interface FriendRequest {
  id: number;
  requesting: {
    id: number;
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

export default function FriendList({
  userId,
  friendRequests,
}: {
  userId: number;
  friendRequests: boolean;
}) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<FriendRequest[]>([]);
  const [updated, setUpdated] = useState(false);
  const onlines = useContext(Context).online;

  const navigate = useNavigate();

  const fetchData = () => {
    if (friendRequests) {
      fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/relations/getRequests/${userId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setRequests(data);
        });
    }
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
  };

  useEffect(() => {
    if (!updated) return;
    setUpdated(false);
    fetchData();
  }, [updated]);

  useEffect(() => {
    fetchData();
  }, [friendRequests]);

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

  const checkOnline = (id: number) => {
    if (onlines.findIndex((online) => online === id) !== -1) return 'online';
    if (onlines.findIndex((online) => online === -id) !== -1) return 'ingame';
    return 'offline';
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
          {friendRequests && requests.length ? (
            <>
              <h3>requests</h3>
              {requests.map((req) => (
                <div className="friend-item">
                  <div
                    onClick={() =>
                      navigate('/users/' + req.requesting.username)
                    }
                  >
                    <img
                      src={req.requesting.avatar}
                      alt=""
                      className="profile-info-img sm"
                      style={{ marginRight: '1rem' }}
                    />
                    <p>{req.requesting.username}</p>
                    <div
                      className={`my-dot ${checkOnline(req.requesting.id)}`}
                    />
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
          {friends.length ? (
            <>
              {friends.map((friend) => (
                <div className="friend-item">
                  <div
                    onClick={() =>
                      navigate('/users/' + friend.requesting.username)
                    }
                  >
                    <img
                      src={friend.requesting.avatar}
                      alt=""
                      className="profile-info-img sm"
                      style={{ marginRight: '1rem' }}
                    />
                    <p>{friend.requesting.username}</p>
                    <div
                      className={`my-dot ${checkOnline(friend.requesting.id)}`}
                    ></div>
                  </div>
                  <div>
                    {friendRequests && (
                      <button
                        className="game-popup-btn btn-home"
                        onClick={() => declineFriend(friend.id)}
                      >
                        unfriend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              style={{ height: '100%', display: 'grid', placeItems: 'center' }}
            >
              no friends yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}



import Wrapper from '../components/Wrapper'
import { useState, useEffect } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { User } from '../models/User.interface';
import axios from 'axios';

const ENDPOINT = `http://${process.env.REACT_APP_BASE_IP}:3000/game`;

export default function PongGame() {
  const [socket, setSocket] = useState<Socket>();
  const [user, setUser] = useState<User>();
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    async function getUser() {
      const {data} = await axios.get(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {withCredentials: true});
      setUser(data);
    }
    getUser()
    const sock = socketIOClient(ENDPOINT)
    
    sock.on('gameCreated', (data) => {
      addResponse(data.username + ' created the game: ' + data.gameId)
    });
    sock.on('joinSuccess', (data) => {
      addResponse('Joining the following game: ' + data.gameId)
    });
    sock.on('alreadyJoined', (data) => {
      addResponse('You are already in an Existing Game: ' + data.gameId);
    });
    sock.on('leftGame', (data) => {
      addResponse('Leaving Game ' + data.gameId);
    });
    sock.on('notInGame', function () {
      addResponse('You are not currently in a Game.');
    });
    sock.on('gameDestroyed', function (data) { 
      addResponse(data.gameOwner+ ' destroyed game: ' + data.gameId);
    });
    setSocket(sock);
  }, []);
  
  function addResponse(res: string) {
    setResponses(prevResponses => {
      return [...prevResponses, res]
    })
  }

  function joinGame() {
    socket!.emit('joinGame', {username: user?.username});
  };

  function leaveGame() {
    socket!.emit('leaveGame', {username: user?.username});
  };

  return (
    <div>
      <button onClick={joinGame}>Join Game</button>
      <button onClick={leaveGame}>Leave Game</button>
      {
        responses.map(response => <p>{response}</p>)
      }
    </div>
    
  );
}

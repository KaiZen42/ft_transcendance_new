import { useRef, useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socketIOClient, { Socket } from 'socket.io-client';
import { Context } from '../App';
import opponent_img from '../assets/opponent.jpeg';
import GamePopUp from '../components/GamePopPup';
import {
  GameState,
  Net,
  OPPONENT_COLOR,
  Player,
  User,
  UserWL,
  USER_COLOR,
} from '../models/Game.interfaces';

import '../styles/Game.css';

interface GameFriend {
  id: number;
  username: string;
  avatar: string;
  requesting: boolean;
  idRequesting?: number;
}

export default function Pong({ inverted }: { inverted?: boolean }) {
  const contextSocket: Socket = useContext(Context).socket!;
  const userId: number = useContext(Context).userId!;
  const ENDPOINT = `http://${process.env.REACT_APP_BASE_IP}:3001/pong`;

  const [user, setUser] = useState<UserWL>();
  const [updatedUser, setUpdatedUser] = useState<UserWL>();
  const [opponent, setOpponent] = useState<User>();
  const [winner, setWinner] = useState<number>();
  const [safe, setSafe] = useState<Socket>();

  const navigate = useNavigate();
  const friend: GameFriend = useLocation().state as GameFriend;

  const [watchId] = useState(
    new URLSearchParams(window.location.search).get('watchId')
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let socket: Socket;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let playerNumber: number;
  let searching: boolean = true;
  let net: Net = {
    x: 0,
    y: 0,
    width: 2,
    height: 10,
    color: 'white',
  };

  const keydown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      socket.emit('keyDown', e.key);
  };
  const keyup = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      socket.emit('keyUp', e.key);
  };

  const drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  const drawBall = (x: number, y: number, r: number, color: string) => {
    if (playerNumber === 1) x = canvas.width - x;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  };

  const drawText = (text: string, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.font = '45px Bebas Neue';
    ctx.fillText(text, x, y);
  };

  const drawNet = () => {
    for (let i = 0; i < canvas.height; i += 15) {
      drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
  };

  const drawField = () => {
    // drawing my half
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 2);
    ctx.lineTo(2, 2);
    ctx.lineTo(2, canvas.height - 2);
    ctx.lineTo(canvas.width / 2, canvas.height - 2);
    ctx.lineWidth = 4;
    ctx.shadowBlur = 4;
    ctx.strokeStyle = inverted ? USER_COLOR : OPPONENT_COLOR;
    ctx.shadowColor = inverted ? USER_COLOR : OPPONENT_COLOR;
    ctx.stroke();

    // drawing opponent half
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 2);
    ctx.lineTo(canvas.width - 2, 2);
    ctx.lineTo(canvas.width - 2, canvas.height - 2);
    ctx.lineTo(canvas.width / 2, canvas.height - 2);
    ctx.strokeStyle = inverted ? OPPONENT_COLOR : USER_COLOR;
    ctx.shadowColor = inverted ? OPPONENT_COLOR : USER_COLOR;
    ctx.stroke();

    ctx.shadowBlur = 0;
  };

  const drawPaddles = (players: [Player, Player]) => {
    let player = players[playerNumber];
    ctx.lineWidth = 4;
    ctx.strokeStyle = inverted ? OPPONENT_COLOR : USER_COLOR;
    ctx.shadowColor = inverted ? OPPONENT_COLOR : USER_COLOR;
    ctx.shadowBlur = 5;
    ctx.strokeRect(players[0].x + 2, player.y, player.width, player.height);

    player = players[playerNumber ? 0 : 1];
    ctx.strokeStyle = inverted ? USER_COLOR : OPPONENT_COLOR;
    ctx.shadowColor = inverted ? USER_COLOR : OPPONENT_COLOR;
    ctx.strokeRect(players[1].x - 2, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
  };

  const drawScores = (scores: [number, number]) => {
    let score = scores[playerNumber].toString();
    ctx.strokeStyle = USER_COLOR;
    ctx.shadowColor = USER_COLOR;
    ctx.shadowBlur = 3;
    ctx.textAlign = 'center';
    ctx.font = '55px Bebas Neue';
    ctx.strokeText(score, canvas.width / 4, canvas.height / 5);

    score = scores[playerNumber ? 0 : 1].toString();
    ctx.strokeStyle = OPPONENT_COLOR;
    ctx.shadowColor = OPPONENT_COLOR;
    ctx.strokeText(score, (3 * canvas.width) / 4, canvas.height / 5);

    ctx.shadowBlur = 0;
  };

  const render = (state: GameState) => {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.3)');

    // draw field outline
    drawField();

    // draw the net
    drawNet();

    // draw the score
    drawScores([state.players[0].score, state.players[1].score]);

    // draw the paddles
    drawPaddles(state.players);

    // draw the ball
    if (playerNumber === 1 && state.ball.color)
      state.ball.color = state.ball.color === 1 ? 2 : 1;
    const ballColor = ['white', USER_COLOR, OPPONENT_COLOR][state.ball.color];
    drawBall(state.ball.x, state.ball.y, state.ball.radius, ballColor);
  };

  const handleGameState = (state: GameState) => {
    if (!canvas) return;

    if (searching) {
      canvas.width = state.fieldWidth;
      canvas.height = state.fieldHeight;
      searching = false;
      net.x = canvas.width / 2 - net.width / 2;
    }
    requestAnimationFrame(() => render(state));
  };

  const endGame = (winner: number, scores: number[]) => {
    setUser((prevUser) => ({
      ...prevUser!,
      score: scores[playerNumber],
    }));
    setOpponent((prevOpponent) => ({
      ...prevOpponent!,
      score: scores[playerNumber ? 0 : 1],
    }));
    setWinner(winner);
    contextSocket.emit('NotInGame', userId);
  };

  const handleGameOver = (winner: number, scores: number[]) => {
    setTimeout(() => {
      endGame(winner, scores);
    }, 200);
  };

  const handlePlayers = (players: [User, User]) => {
    if (watchId) {
      playerNumber = 0;
      setUser({ ...players[0], score: 0, wins: 0, losses: 0 });
      setOpponent({ ...players[1], score: 0 });
      return;
    }

    if (playerNumber) setOpponent({ ...players[0], score: 0 });
    else setOpponent({ ...players[1], score: 0 });

    contextSocket.emit('InGame', userId);
    startCountdown();
  };

  const handlePlayerNumber = (number: number) => {
    playerNumber = number;
  };

  const joinGame = (tmp_user: UserWL) => {
    const userInfo = {
      id: tmp_user.id,
      username: tmp_user.username,
      points: tmp_user.points,
      avatar: tmp_user.avatar,
    };

    if (friend) {
      friend.requesting
        ? socket.emit('createFriendlyMatch', userInfo)
        : socket.emit('acceptFriendlyMatch', {
            user: userInfo,
            friendId: friend.idRequesting,
          });
    } else
      socket.emit('joinGame', {
        user: userInfo,
        inverted: inverted ? true : false,
      });
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
  };

  const initSocket = () => {
    if (safe) safe.close();

    socket = socketIOClient(ENDPOINT);
    socket.on('gameState', handleGameState);
    socket.on('gameOver', handleGameOver);
    socket.on('playerNumber', handlePlayerNumber);
    socket.on('players', handlePlayers);
    socket.on('friendlyMatchExpired', handleExpired);
    socket.on('alreadyInGame', handleAlreadyInGame);
    setSafe(socket);
  };

  const handleAlreadyInGame = () => {
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0)');
    drawText(`You are already in a game`, 375, 40, 'white');
  };

  const handleExpired = () => {
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0)');
    drawText(`Invitation Expired`, 375, 40, 'white');
  };

  const handleNoGameFound = () => {
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0)');
    drawText(`no game found`, 375, 40, 'white');
  };

  const defaultCanva = () => {
    canvas = canvasRef.current!;
    ctx = canvas.getContext('2d')!;
    canvas.width = 750;
    canvas.height = 40;
    if (watchId) return;
    if (friend) drawText(`Waiting for your friend...`, 375, 40, 'white');
    else drawText('Searching for an opponent...', 375, 40, 'white');
  };

  const startCountdown = () => {
    let num = 3;
    setTimeout(() => {
      drawRect(canvas.width / 2 - 20, 62, 40, 40, 'black');
      drawText(
        (num--).toString(),
        canvas.width / 2,
        canvas.height / 5,
        'white'
      );
    }, 500);
    setTimeout(() => {
      const intvl = setInterval(() => {
        drawRect(canvas.width / 2 - 20, 62, 40, 40, 'black');
        drawText(
          (num--).toString(),
          canvas.width / 2,
          canvas.height / 5,
          'white'
        );
        if (num === 0) clearInterval(intvl);
      }, 1000);
    }, 500);
  };

  const initWatchSocket = () => {
    if (safe) safe.close();

    socket = socketIOClient(ENDPOINT);
    socket.on('gameState', handleGameState);
    socket.on('gameOver', handleGameOver);
    socket.on('players', handlePlayers);
    socket.on('noGameFound', handleNoGameFound);
    setSafe(socket);
  };

  useEffect(() => {
    if (!watchId) return;
    defaultCanva();
    initWatchSocket();
    socket.emit('watchGame', Number(watchId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (watchId) return;
    async function getter() {
      const res = await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`,
        { credentials: 'include' }
      );
      const user = await res.json();
      setUser({ ...user, score: 0 });
      joinGame(user);
    }
    getter();
    defaultCanva();
    initSocket();
    return () => {
      if (contextSocket) contextSocket.emit('NotInGame', user);
      contextSocket?.removeListener('gameState');
      contextSocket?.removeListener('gameOver');
      contextSocket?.removeListener('playerNumber');
      contextSocket?.removeListener('players');
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restartGame = () => {
    setUser(updatedUser);
    setOpponent(undefined);
    setWinner(undefined);
    defaultCanva();
    initSocket();
    joinGame(user!);
  };

  async function updatePoints(points: number, wins: number, losses: number) {
    fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/update/${
        user!.id
      }`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points, wins, losses }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUpdatedUser({ ...data, score: 0 });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <>
      <div className="container h-100 w-100">
        <div
          className={`row align-items-center ${
            opponent && !watchId ? 'h-100' : 'h-80'
          }`}
          style={{ paddingTop: opponent ? '' : '15%' }}
        >
          <div className="col col-centered">
            {user ? (
              <>
                <img
                  alt="profile"
                  src={user?.avatar}
                  className="game--image game-user"
                />
                <p className="game-text">{user?.username}</p>
                <p className="game-text">
                  {user?.points} <small>pts</small>
                </p>
              </>
            ) : (
              <img
                alt="profile"
                src={opponent_img}
                className="game--image game-opponent"
              />
            )}
          </div>

          <div className="col col-centered">
            <canvas ref={canvasRef} />
          </div>
          <div className="col col-centered">
            {opponent ? (
              <>
                <img
                  alt="profile"
                  src={opponent.avatar}
                  className="game--image game-opponent"
                />
                <p className="game-text">{opponent.username}</p>
                <p className="game-text">
                  {opponent.points} <small>pts</small>
                </p>
              </>
            ) : friend && friend.requesting ? (
              <>
                <img
                  alt="profile"
                  src={friend.avatar}
                  className="game--image game-opponent"
                />
                <p className="game-text">{friend.username}</p>
              </>
            ) : (
              <img
                alt="profile"
                src={opponent_img}
                className="game--image game-opponent"
              />
            )}
          </div>
        </div>

        <div
          className="row align-items-start justify-content-center"
          style={{ height: '20%' }}
        >
          <div className="col-2 col-centered ">
            <button
              onClick={() => {
                if (safe) safe.close();
                navigate('/');
              }}
              style={{ backgroundColor: 'white', width: 'auto' }}
              className="game-popup-btn btn-home"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
      <GamePopUp
        winner={winner}
        users={[user, opponent]}
        playAgain={restartGame}
        updatePoints={updatePoints}
        watch={watchId ? true : false}
        friendly={friend ? true : false}
      />
      <video autoPlay muted loop className="video">
        <source src="./movie2.webm" type="video/webm" />
        <source src="../movie2.webm" type="video/webm" />
      </video>
    </>
  );
}

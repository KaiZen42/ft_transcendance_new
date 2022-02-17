import { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import socketIOClient, { Socket } from 'socket.io-client';
import '../styles/Game.css';
import opponent_img from "../assets/opponent.jpeg"

const USER_COLOR = "rgb(201, 0, 241)"
const OPPONENT_COLOR = "rgb(76, 123, 214)"

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: number;
}

interface Net {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface GameState {
  players: [Player, Player];
  food: {
    x: number;
    y: number;
  };
  ball: Ball;
  fieldWidth: number;
  fieldHeight: number;
}

interface User {
  username: string,
  points: number,
  avatar: string
}

export default function Pong(props: any) {

  const [user, setUser] = useState<User>()
  const [opponent, setOpponent] = useState<User>()

  const ENDPOINT = `http://${process.env.REACT_APP_BASE_IP}:3001/pong`;

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
    if (playerNumber === 1)
      x = canvas.width - x

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  };

  const drawText = (text: string, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.textAlign = "center"
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
    ctx.moveTo(canvas.width/2, 2);
    ctx.lineTo(2, 2);
    ctx.lineTo(2, canvas.height-2);
    ctx.lineTo(canvas.width/2, canvas.height-2);
    ctx.lineWidth = 4
    ctx.shadowBlur = 4;
    ctx.strokeStyle = OPPONENT_COLOR;
    ctx.shadowColor = OPPONENT_COLOR;
    ctx.stroke()
    
    // drawing opponent half
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 2);
    ctx.lineTo(canvas.width-2, 2);
    ctx.lineTo(canvas.width-2, canvas.height-2);
    ctx.lineTo(canvas.width/2, canvas.height-2);
    ctx.strokeStyle = USER_COLOR
    ctx.shadowColor = USER_COLOR;
    ctx.stroke()

    ctx.shadowBlur = 0;
  }

  const drawPaddles = (players: [Player, Player]) => {

    let player = players[playerNumber];
    ctx.lineWidth = 4;
    ctx.strokeStyle = USER_COLOR;
    ctx.shadowColor = USER_COLOR;
    ctx.shadowBlur = 5;
    ctx.strokeRect(players[0].x+2, player.y, player.width, player.height);

    player = players[(playerNumber) ? 0 : 1]
    ctx.strokeStyle = OPPONENT_COLOR;
    ctx.shadowColor = OPPONENT_COLOR;
    ctx.strokeRect(players[1].x-2, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
  }

  const drawScores = (scores: [number, number]) => {
    let score = scores[playerNumber].toString()
    ctx.strokeStyle = USER_COLOR;
    ctx.shadowColor = USER_COLOR;
    ctx.shadowBlur = 3;
    ctx.textAlign = "center"
    ctx.font = '55px Bebas Neue';
    ctx.strokeText(score,  canvas.width / 4, canvas.height / 5);

    score = scores[(playerNumber) ? 0 : 1].toString()
    ctx.strokeStyle = OPPONENT_COLOR;
    ctx.shadowColor = OPPONENT_COLOR;
    ctx.strokeText(score,  (3 * canvas.width) / 4, canvas.height / 5);

    ctx.shadowBlur = 0;
  }

  const render = (state: GameState) => {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.3)');

    // draw field outline
    drawField()

    // draw the net
    drawNet();

    // draw the score
    drawScores([state.players[0].score, state.players[1].score])

    // draw the paddles
    drawPaddles(state.players)

    // draw the ball
    if (playerNumber===1 && state.ball.color)
      state.ball.color = (state.ball.color === 1) ? 2 : 1
    const ballColor = ["white", USER_COLOR, OPPONENT_COLOR][state.ball.color]
    drawBall(state.ball.x, state.ball.y, state.ball.radius, ballColor);
  };

  const handleGameState = (state: GameState) => {
    if (searching) {
      canvas.width = state.fieldWidth;
      canvas.height = state.fieldHeight;
      searching = false;
      net.x = canvas.width / 2 - net.width / 2;
    }
    requestAnimationFrame(() => render(state));
  };

  const handleGameOver = (winner: number) => {
    if (winner == playerNumber)
      setTimeout(() => {
        alert('You win!');
      }, 200);
    else
      setTimeout(() => {
        alert('You lose.');
      }, 200);
  };

  const handlePlayers = (players: [User, User]) => {
    if (players[0].username === user?.username)
    {
      setOpponent(players[1])
      playerNumber = 0
    }
    else
    {
      setOpponent(players[0])
      playerNumber = 1
    }
  }

  const joinGame = (tmp_user: User) => {
    socket.emit('joinGame', tmp_user);

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
  };

  useEffect(() => {
    async function getter() {
      const res = await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {credentials: 'include'}
      );
      const user = await res.json();
      setUser(user);
      joinGame(user);
    }

    getter();
    canvas = canvasRef.current!;
    ctx = canvas.getContext('2d')!;
    canvas.width = 500;
    canvas.height = 50;
    drawText('Searching for an opponent...', 250, 40, 'white');
    if (!socket) {
      socket = socketIOClient(ENDPOINT);
      socket.on('gameState', handleGameState);
      socket.on('gameOver', handleGameOver);
      socket.on('players', handlePlayers);
    }

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <div className="container h-100 w-100">
        <div className='row h-100 align-items-center'>
          <div className='col col-centered'>
             <img alt="profile image" src={user?.avatar} className="game--image game-user"/>
             <p className='game-text'>{user?.username}</p>
             <p className='game-text'>{user?.points}  <small>pts</small></p>
          </div>
          <div className="col col-centered">
            <canvas ref={canvasRef} />
          </div>
          <div className='col col-centered'>
            {
              opponent ?
                <>
                <img alt="profile image" src={opponent.avatar} className="game--image game-opponent"/>
                <p className='game-text'>{opponent.username}</p>
                <p className='game-text'>{opponent.points}  <small>pts</small></p>
                </>
              :
                <img alt="profile image" src={opponent_img} className="game--image game-opponent"/>
            }
          </div>
        </div>
        <NavLink to={'/'} >
          <div >Back to home</div>
        </NavLink>
      </div>
      <video autoPlay muted loop className="video">
        <source src="./movie2.webm" type="video/webm" />
      </video>
    </>
  );
}

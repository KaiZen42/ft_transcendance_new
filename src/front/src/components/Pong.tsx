
import { useRef, useEffect, useState } from 'react'
import socketIOClient, { Socket } from 'socket.io-client';
import "../styles/PongGame.css"

interface Player {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  score: number
}

interface Ball {
  x: number,
  y: number,
  radius: number,
  speed: number,
  velocityX: number,
  velocityY: number,
  color: string
}

interface Net {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
}

interface GameState {
  players: Player[],
  food: {
    x: number,
    y: number
  },
  ball : Ball,
  fieldWidth: number,
	fieldHeight: number
}

export default function Pong(props: any) {

  const ENDPOINT = `http://${process.env.REACT_APP_BASE_IP}:3001/pong`;

  const canvasRef = useRef<HTMLCanvasElement>(null)
  let socket : Socket
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let playerNumber: number
  let gameActive: boolean = false
  let searching: boolean = true
  let net: Net = {
    x: 0,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
  }

  const keydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown")
      socket.emit("keyDown", e.key)
  }
  const keyup = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown")
      socket.emit("keyUp", e.key)
  }

  const drawRect = (x:number, y:number, w:number, h:number, color:string) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }

  const drawCircle = (x:number, y:number, r:number, color:string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI*2, false)
    ctx.closePath()
    ctx.fill()
  }

  const drawText = (text:string, x:number, y:number, color:string) => {
    ctx.fillStyle = color
    ctx.font = "45px Bebas Neue"
    ctx.fillText(text, x, y)
  }

  const drawNet = () => {
    for (let i = 0; i < canvas.height; i+=15) {
      drawRect(net.x, net.y+i, net.width, net.height, net.color)      
    }
  }

  const render = (state: GameState) => {
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.3)')
    
    // draw field outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // draw the net
    drawNet()

    // draw the score
    drawText(state.players[0].score.toString(), state.fieldWidth/4, state.fieldHeight/5, "white")
    drawText(state.players[1].score.toString(), 3*state.fieldWidth/4, state.fieldHeight/5, "white")

    // draw the paddles
    for (let i = 0; i<2; i++)
    {
      const player = state.players[i]
      drawRect(player.x, player.y, player.width, player.height, player.color)
    }

    // draw the ball
    drawCircle(state.ball.x, state.ball.y, state.ball.radius, state.ball.color)
  }

  const handleGameState = (state:GameState) => {
    if (searching)
    {
      canvas.width = state.fieldWidth
      canvas.height = state.fieldHeight
      searching = false
      net.x = canvas.width/2-net.width/2
    }
    if (!gameActive)
      return
    requestAnimationFrame(()=> render(state))
  }

  const handleGameOver = (winner: number) => {
    if (!gameActive)
      return
    console.log("gameOver")
    if (winner == playerNumber)
      setTimeout(() => {alert("You win!")}, 200);
    else
      setTimeout(() => {alert("You lose.")}, 200);
    gameActive = false
  }

  const handleInit = (number: number) => {
    console.log("Game init: "+number)
    playerNumber = number
    console.log("player number: "+playerNumber)
  }

  const joinGame = () => {
    socket.emit("joinGame")
    init()
  }

  const init = ()=>{
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyup)
    gameActive = true
  }

  useEffect(() => {
    canvas = canvasRef.current!
    ctx = canvas.getContext('2d')!
    canvas.width = 500
    canvas.height = 50
    drawText("Searching for an opponent...", 10, 40, "white")
    if (!socket)
    {
      socket = socketIOClient(ENDPOINT)
      socket.on("gameState", handleGameState)
      socket.on("gameOver", handleGameOver)
      socket.on("init", handleInit)
    }

    if (props.start)
      joinGame()
    
    return () => {socket.close()};
  }, [props.start])

  return (<>
        <canvas ref={canvasRef}/></>)
}
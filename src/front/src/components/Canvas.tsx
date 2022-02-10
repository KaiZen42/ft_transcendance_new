
import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import socketIOClient, { Socket } from 'socket.io-client';

interface Player {
  pos: {
    x: number,
    y: number
  },
  vel: {
    x: number,
    y: number
  },
  snake: [
    {x: number, y:number}
  ]
}

interface GameInfo {
  player: Player,
  food: {
    x: number,
    y: number
  },
  gridSize: number
}


export default function Canvas() {

  const BG_COLOR = "#231f20"
  const SNAKE_COLOR = "#c2c2c2"
  const FOOD_COLOR = "#e66916"
  const ENDPOINT = `http://${process.env.REACT_APP_BASE_IP}:3001/snake`;

  const canvasRef = useRef<HTMLCanvasElement>(null)
  let socket : Socket
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  const keydown = (e: KeyboardEvent) => {
    socket.emit("keyDown", e.key)
  }

  const paintGame = (state: GameInfo) => {
    if (!state)
      return
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0,0, canvas.width, canvas.height)

    const food = state.food
    const gridSize = state.gridSize
    const size = canvas.width / gridSize

    ctx.fillStyle = FOOD_COLOR
    ctx.fillRect(food.x * size, food.y * size, size, size)

    paintPlayer(state.player, state.gridSize)
  }

  const paintPlayer = (player: Player, gridSize: number) => {
    if (!player)
      return
    const snake = player.snake
    const size = canvas.width / gridSize

    ctx.fillStyle = SNAKE_COLOR
    for (let cell of snake)
      ctx.fillRect(cell.x * size, cell.y * size, size, size)
  }

  const handleGameState = (state: any) => {
    state = JSON.parse(state)
    requestAnimationFrame(()=> paintGame(state))
  }

  const handleGameOver = () => {
    alert("You lose!")
  }

  useLayoutEffect(() => {
    canvas = canvasRef.current!
    ctx = canvas.getContext('2d')!

    canvas.width = canvas.height = 600

    document.addEventListener('keydown', keydown)

    socket = socketIOClient(ENDPOINT)

    socket.on("gameState", handleGameState)
    socket.on("gameOver", handleGameOver)
    
    return () => {socket.close()};
  }, [])

  return <canvas ref={canvasRef}/>
}


import { useRef, useEffect, useState } from 'react'
import socketIOClient, { Socket } from 'socket.io-client';
import "../styles/PongGame.css"

interface Player {
  pos: {
    x: number,
    y: number
  },
  vel: {
    x: number,
    y: number
  },
  snake:
    {x: number, y:number}[]
}

interface GameInfo {
  players: Player[],
  food: {
    x: number,
    y: number
  },
  gridSize: number
}

export default function Game(props: any) {

  const BG_COLOR = "#231f20"
  const SNAKE_COLOR = "#c2c2c2"
  const FOOD_COLOR = "#e66916"
  const ENDPOINT = `http://${process.env.REACT_APP_BASE_IP}:3001/snake`;

  const canvasRef = useRef<HTMLCanvasElement>(null)
  let socket : Socket
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let playerNumber: number
  let gameActive: boolean = false

  const [searching, setSearching] = useState<boolean>(true)

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

    paintPlayer(state.players[0], state.gridSize, SNAKE_COLOR)
    paintPlayer(state.players[1], state.gridSize, 'red')
  }

  const paintPlayer = (player: Player, gridSize: number, color: string) => {
    if (!player)
      return
    const snake = player.snake
    const size = canvas.width / gridSize

    ctx.fillStyle = color
    for (let cell of snake)
      ctx.fillRect(cell.x * size, cell.y * size, size, size)
  }

  const handleGameState = (state: any) => {
    if (searching)
    {
      canvas.width = canvas.height = 600
      setSearching(false)
    }
    if (!gameActive)
      return
    state = JSON.parse(state)
    requestAnimationFrame(()=> paintGame(state))
  }

  const handleGameOver = (winner: number) => {
    if (!gameActive)
      return
    console.log("gameOver")
    if (winner == playerNumber)
      alert("You win!")
    else
      alert("You lose.")
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
    canvas = canvasRef.current!
    ctx = canvas.getContext('2d')!
    canvas.width = canvas.height = 0

    document.addEventListener('keydown', keydown)
    gameActive = true
  }

  useEffect(() => {
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

  return (<><h3 className="white-text" style={{display : searching ? "block" : "none"}}>Searching for an opponent...</h3>
        <canvas ref={canvasRef}/></>)
}
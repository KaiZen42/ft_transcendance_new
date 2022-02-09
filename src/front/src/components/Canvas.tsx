
import { useRef, useEffect, useState, useLayoutEffect } from 'react'

interface GameInfo {
  player1 : number,
  player2 : number,
  ball : {
    x: number,
    y: number
  }
}

const FIELD_H = 600
const FIELD_W = 1200

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

  const [gameState, setGameState] = useState<GameInfo>({
    player1: FIELD_H / 2,
    player2: FIELD_H / 2,
    ball: {
      x: FIELD_W / 2,
      y: FIELD_H / 2
    }
  })

  function keydown(e: KeyboardEvent){
    console.log("a key was pressed: " + e.key)
  }

  function paintGame() {
    if (!ctx)
      return
    ctx!.fillStyle = ('#000')
    ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
    const size_w = canvas!.width / FIELD_W
    const size_h = canvas!.height / FIELD_H

    ctx!.fillStyle = ('#fff')
    ctx!.fillRect(5 * size_w, gameState.player1 * size_h - 22.2 * size_h, 5 * size_w, 45 * size_h)
    ctx!.fillRect(canvas!.width - 10 * size_w, gameState.player1 * size_h - 22.2 * size_h, 5 * size_w, 45 * size_h)
  }

  useEffect(()=> {
    const tmp_canvas = canvasRef.current!
    setCanvas(tmp_canvas)
    const context = tmp_canvas.getContext('2d')!
    setCtx(context)
    tmp_canvas.width = window.innerWidth
    tmp_canvas.height = window.innerHeight

    context.fillStyle = ('#000')
    context.fillRect(0, 0, tmp_canvas.width, tmp_canvas.height)

    document.addEventListener('keydown', keydown)
    paintGame()
  })

  return <canvas ref={canvasRef}/>
}


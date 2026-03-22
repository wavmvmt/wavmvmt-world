'use client'

import { useEffect, useRef, useState } from 'react'
import { ROOMS, COLORS } from '@/lib/roomConfig'

function colorToCSS(n: number): string {
  return '#' + n.toString(16).padStart(6, '0')
}

/** 2D overhead minimap of the warehouse — shows rooms and player position */
export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // World bounds
    const worldMinX = -260, worldMaxX = 260
    const worldMinZ = -240, worldMaxZ = 170
    const worldW = worldMaxX - worldMinX
    const worldH = worldMaxZ - worldMinZ

    const mapW = canvas.width
    const mapH = canvas.height

    function worldToMap(wx: number, wz: number): [number, number] {
      const mx = ((wx - worldMinX) / worldW) * mapW
      const my = ((wz - worldMinZ) / worldH) * mapH
      return [mx, my]
    }

    let playerX = 0, playerZ = 12
    let animId: number

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, mapW, mapH)

      // Background
      ctx.fillStyle = 'rgba(26,21,32,0.85)'
      ctx.fillRect(0, 0, mapW, mapH)

      // Warehouse outline
      const [wlx, wly] = worldToMap(-250, -230)
      const [wrx, wry] = worldToMap(250, 160)
      ctx.strokeStyle = 'rgba(240,198,116,0.15)'
      ctx.lineWidth = 1
      ctx.strokeRect(wlx, wly, wrx - wlx, wry - wly)

      // Rooms
      for (const room of ROOMS) {
        const [rx, ry] = worldToMap(room.x - room.w / 2, room.z - room.d / 2)
        const [rx2, ry2] = worldToMap(room.x + room.w / 2, room.z + room.d / 2)
        const rw = rx2 - rx
        const rh = ry2 - ry

        // Room fill
        const color = colorToCSS(room.color)
        ctx.fillStyle = room.buildPct > 0
          ? `${color}${Math.floor(15 + room.buildPct * 0.4).toString(16)}`
          : `${color}08`
        ctx.fillRect(rx, ry, rw, rh)

        // Room border
        ctx.strokeStyle = `${color}60`
        ctx.lineWidth = 0.5
        ctx.strokeRect(rx, ry, rw, rh)

        // Room label
        ctx.fillStyle = `${color}90`
        ctx.font = '5px DM Sans, sans-serif'
        ctx.textAlign = 'center'
        const shortName = room.name.length > 10 ? room.name.slice(0, 8) + '..' : room.name
        ctx.fillText(shortName, rx + rw / 2, ry + rh / 2 + 2)
      }

      // Player dot
      const [px, py] = worldToMap(playerX, playerZ)
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#f0c674'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(240,198,116,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Player pulse
      const pulse = (Date.now() % 2000) / 2000
      ctx.beginPath()
      ctx.arc(px, py, 3 + pulse * 6, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(240,198,116,${0.3 * (1 - pulse)})`
      ctx.lineWidth = 0.5
      ctx.stroke()

      animId = requestAnimationFrame(draw)
    }

    // Listen for player position updates
    function onPlayerMove(e: CustomEvent) {
      playerX = e.detail.x
      playerZ = e.detail.z
    }
    window.addEventListener('playerMove' as string, onPlayerMove as EventListener)

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('playerMove' as string, onPlayerMove as EventListener)
    }
  }, [collapsed])

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-20 md:bottom-8 left-3 md:left-5 pointer-events-auto px-3 py-2 rounded-xl text-[0.6rem] tracking-wider uppercase cursor-pointer z-10"
        style={{
          background: 'rgba(26,21,32,0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,200,120,0.12)',
          color: 'rgba(255,220,180,0.5)',
        }}
      >
        ◫ Map
      </button>
    )
  }

  return (
    <div
      className="fixed bottom-20 md:bottom-8 left-3 md:left-5 pointer-events-auto z-10 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(26,21,32,0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,200,120,0.12)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.35)' }}>
          Floor Plan
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="w-4 h-4 flex items-center justify-center rounded cursor-pointer text-[0.5rem]"
          style={{ color: 'rgba(255,220,180,0.3)' }}
        >
          −
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={180}
        height={140}
        className="block"
      />
    </div>
  )
}

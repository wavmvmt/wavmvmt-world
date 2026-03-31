'use client'

import { useEffect, useRef, useState } from 'react'
import { ROOMS, OUTDOOR_ZONES, COLORS } from '@/lib/roomConfig'

function colorToCSS(n: number): string {
  return '#' + n.toString(16).padStart(6, '0')
}

// Room icons/symbols for legend — true video game minimap
const ROOM_ICONS: Record<string, string> = {
  'Parkour Gym': '🏃',
  'Sound Bath': '🔔',
  'Music Studio': '🎵',
  'Cafe & Lounge': '☕',
  'Front Desk': '🏢',
  'Yoga Room': '🧘',
  'Weight Training': '💪',
  'Amphitheatre': '🎭',
  'Photo Studio': '📸',
  'Video Studio': '🎬',
  'Recovery Suite': '❄️',
  'Spa & Wellness': '🧖',
  'Education Wing': '📚',
}

/** 2D overhead minimap of the warehouse — shows rooms, player position, icons, and legend */
export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [expanded, setExpanded] = useState(false) // full-size mode
  const [showLegend, setShowLegend] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // World bounds
    const worldMinX = -280, worldMaxX = 280
    const worldMinZ = -400, worldMaxZ = 250
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

      // Background — brighter for better contrast
      ctx.fillStyle = 'rgba(20,16,28,0.92)'
      ctx.fillRect(0, 0, mapW, mapH)

      // Grid lines for spatial reference
      ctx.strokeStyle = 'rgba(240,198,116,0.04)'
      ctx.lineWidth = 0.5
      for (let gx = worldMinX; gx <= worldMaxX; gx += 50) {
        const [mx] = worldToMap(gx, 0)
        ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, mapH); ctx.stroke()
      }
      for (let gz = worldMinZ; gz <= worldMaxZ; gz += 50) {
        const [, my] = worldToMap(0, gz)
        ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(mapW, my); ctx.stroke()
      }

      // Warehouse outline — brighter
      const [wlx, wly] = worldToMap(-250, -230)
      const [wrx, wry] = worldToMap(250, 160)
      ctx.strokeStyle = 'rgba(240,198,116,0.25)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(wlx, wly, wrx - wlx, wry - wly)

      // Rooms — brighter fills and borders
      const isExpanded = mapW > 200
      for (const room of ROOMS) {
        const [rx, ry] = worldToMap(room.x - room.w / 2, room.z - room.d / 2)
        const [rx2, ry2] = worldToMap(room.x + room.w / 2, room.z + room.d / 2)
        const rw = rx2 - rx
        const rh = ry2 - ry

        // Room fill — much brighter
        const color = colorToCSS(room.color)
        ctx.fillStyle = room.buildPct > 0
          ? `${color}${Math.floor(30 + room.buildPct * 0.8).toString(16).padStart(2, '0')}`
          : `${color}15`
        ctx.fillRect(rx, ry, rw, rh)

        // Room border — stronger
        ctx.strokeStyle = `${color}90`
        ctx.lineWidth = 1
        ctx.strokeRect(rx, ry, rw, rh)

        // Build progress fill from bottom
        if (room.buildPct > 0) {
          const fillH = rh * (room.buildPct / 100)
          ctx.fillStyle = `${color}20`
          ctx.fillRect(rx, ry + rh - fillH, rw, fillH)
        }

        // Room icon (emoji) — centered
        const icon = ROOM_ICONS[room.name] || '◆'
        const fontSize = isExpanded ? 10 : 7
        ctx.font = `${fontSize}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(icon, rx + rw / 2, ry + rh / 2 + (isExpanded ? 4 : 3))

        // Room label — only in expanded mode
        if (isExpanded) {
          ctx.fillStyle = `${color}cc`
          ctx.font = 'bold 7px DM Sans, sans-serif'
          ctx.textAlign = 'center'
          const shortName = room.name.length > 12 ? room.name.slice(0, 10) + '..' : room.name
          ctx.fillText(shortName, rx + rw / 2, ry + rh / 2 + 14)
        }
      }

      // Outdoor zones (Phase 3 — faded outlines)
      for (const zone of OUTDOOR_ZONES) {
        const [zx, zy] = worldToMap(zone.x - zone.w / 2, zone.z - zone.d / 2)
        const [zx2, zy2] = worldToMap(zone.x + zone.w / 2, zone.z + zone.d / 2)
        const zw = zx2 - zx
        const zh = zy2 - zy
        const zcolor = colorToCSS(zone.color)

        // Dashed outline
        ctx.setLineDash([3, 3])
        ctx.strokeStyle = `${zcolor}40`
        ctx.lineWidth = 0.8
        ctx.strokeRect(zx, zy, zw, zh)
        ctx.setLineDash([])

        // Label
        ctx.fillStyle = `${zcolor}50`
        ctx.font = `${isExpanded ? 6 : 4}px DM Sans, sans-serif`
        ctx.textAlign = 'center'
        const shortName = zone.name.length > 10 ? zone.name.slice(0, 8) + '..' : zone.name
        ctx.fillText(shortName, zx + zw / 2, zy + zh / 2 + 1.5)
      }

      // Player dot — bigger, brighter
      const [px, py] = worldToMap(playerX, playerZ)
      // Glow
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 12)
      grad.addColorStop(0, 'rgba(240,198,116,0.3)')
      grad.addColorStop(1, 'rgba(240,198,116,0)')
      ctx.fillStyle = grad
      ctx.fillRect(px - 12, py - 12, 24, 24)
      // Dot
      ctx.beginPath()
      ctx.arc(px, py, isExpanded ? 5 : 3.5, 0, Math.PI * 2)
      ctx.fillStyle = '#f0c674'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(px, py, isExpanded ? 7 : 5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(240,198,116,0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Player pulse
      const pulse = (Date.now() % 2000) / 2000
      ctx.beginPath()
      ctx.arc(px, py, (isExpanded ? 5 : 3) + pulse * 8, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(240,198,116,${0.35 * (1 - pulse)})`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // North indicator
      ctx.fillStyle = 'rgba(240,198,116,0.5)'
      ctx.font = `bold ${isExpanded ? 10 : 7}px DM Sans, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('N', mapW / 2, isExpanded ? 14 : 10)
      // Arrow
      ctx.beginPath()
      ctx.moveTo(mapW / 2 - 3, isExpanded ? 17 : 12)
      ctx.lineTo(mapW / 2, isExpanded ? 14 : 10)
      ctx.lineTo(mapW / 2 + 3, isExpanded ? 17 : 12)
      ctx.strokeStyle = 'rgba(240,198,116,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

    }  // draw function ends here — RAF is event-driven, not self-scheduling

    // Event-driven redraw — only when player moves (not every RAF)
    // This cuts from 60fps canvas redraws to ~20fps (matching player movement)
    let rafPending = false
    function scheduleRedraw() {
      if (rafPending) return
      rafPending = true
      animId = requestAnimationFrame(() => {
        rafPending = false
        draw()
      })
    }
    function onPlayerMove(e: CustomEvent) {
      playerX = e.detail.x
      playerZ = e.detail.z
      scheduleRedraw()
    }
    window.addEventListener('playerMove' as string, onPlayerMove as EventListener)

    // Initial draw
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('playerMove' as string, onPlayerMove as EventListener)
    }
  }, [collapsed, expanded])

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-8 right-5 pointer-events-auto px-3 py-2 rounded-xl text-[0.6rem] tracking-wider uppercase cursor-pointer z-10 transition-all hover:border-[rgba(240,198,116,0.3)]"
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
      className={`fixed pointer-events-auto z-10 rounded-2xl overflow-hidden transition-all duration-300 ${
        expanded
          ? 'bottom-4 right-4 left-4 md:left-auto md:right-4 md:bottom-4'
          : 'bottom-8 right-5'
      }`}
      style={{
        background: 'rgba(20,16,28,0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,200,120,0.18)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5">
        <span className="text-[0.55rem] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(255,220,180,0.45)' }}>
          Floor Plan
        </span>
        <div className="flex items-center gap-1.5">
          {/* Legend toggle */}
          <button
            onClick={() => setShowLegend(l => !l)}
            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer text-[0.55rem] transition-all"
            style={{
              color: showLegend ? '#f0c674' : 'rgba(255,220,180,0.3)',
              background: showLegend ? 'rgba(240,198,116,0.1)' : 'transparent',
            }}
            title="Toggle legend"
          >
            ☰
          </button>
          {/* Expand/shrink */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer text-[0.55rem] transition-all"
            style={{ color: 'rgba(255,220,180,0.3)' }}
            title={expanded ? 'Shrink map' : 'Expand map'}
          >
            {expanded ? '⊟' : '⊞'}
          </button>
          {/* Minimize */}
          <button
            onClick={() => { setCollapsed(true); setExpanded(false) }}
            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer text-[0.55rem] transition-all"
            style={{ color: 'rgba(255,220,180,0.3)' }}
            title="Hide map"
          >
            −
          </button>
        </div>
      </div>

      {/* Legend overlay */}
      {showLegend && (
        <div className="px-2.5 pb-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5" style={{ borderBottom: '1px solid rgba(255,200,120,0.08)' }}>
          {ROOMS.map(room => (
            <div key={room.name} className="flex items-center gap-1">
              <span className="text-[0.6rem]">{ROOM_ICONS[room.name] || '◆'}</span>
              <span className="text-[0.45rem] truncate" style={{ color: `${colorToCSS(room.color)}aa` }}>
                {room.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={expanded ? 360 : 240}
        height={expanded ? 400 : 260}
        className="block"
        style={{ maxWidth: '100%' }}
      />
    </div>
  )
}

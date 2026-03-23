'use client'

import { useState, useEffect } from 'react'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Shows a floating tooltip when the player approaches a room.
 * Displays room name, build percentage, and a brief description.
 * Fades in/out smoothly based on proximity.
 */
export function RoomTooltip() {
  const [nearRoom, setNearRoom] = useState<typeof ROOMS[0] | null>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    let lastRoom: string | null = null

    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      let closest: typeof ROOMS[0] | null = null
      let closestDist = Infinity

      for (const room of ROOMS) {
        const dx = x - room.x
        const dz = z - room.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        const threshold = Math.max(room.w, room.d) / 2 + 10

        if (dist < threshold && dist < closestDist) {
          closest = room
          closestDist = dist
        }
      }

      if (closest && closest.name !== lastRoom) {
        setNearRoom(closest)
        setOpacity(1)
        lastRoom = closest.name
      } else if (!closest && lastRoom) {
        setOpacity(0)
        lastRoom = null
        setTimeout(() => setNearRoom(null), 500)
      }
    }

    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  if (!nearRoom) return null

  const colorHex = `#${nearRoom.color.toString(16).padStart(6, '0')}`

  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center transition-all duration-500"
      style={{ opacity: opacity * 0.8 }}
    >
      {/* Room name — large, centered */}
      <div className="text-2xl md:text-4xl font-bold tracking-[0.15em] mb-1"
        style={{
          color: colorHex,
          fontFamily: "'Playfair Display', serif",
          textShadow: `0 0 30px ${colorHex}30`,
          opacity: 0.6,
        }}>
        {nearRoom.name}
      </div>

      {/* Build status */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className="h-px flex-1 max-w-[60px]" style={{ background: `${colorHex}30` }} />
        <span className="text-[0.6rem] font-mono tracking-wider" style={{ color: `${colorHex}80` }}>
          {nearRoom.buildPct}% built
        </span>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: `${colorHex}30` }} />
      </div>

      {/* Vision */}
      <p className="text-[0.6rem] max-w-xs mx-auto" style={{ color: 'rgba(255,220,180,0.25)' }}>
        {nearRoom.vision}
      </p>
    </div>
  )
}

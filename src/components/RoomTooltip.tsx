'use client'

import { useState, useEffect } from 'react'
import { ROOMS } from '@/lib/roomConfig'

const ROOM_INTERACTIONS: Record<string, string> = {
  'Parkour Gym': 'View obstacle course plans',
  'Sound Bath': 'Play a singing bowl',
  'Music Studio': 'Try the beat pads',
  'Cafe & Lounge': 'Check the menu',
  'Amphitheatre': 'Step on stage',
  'Weight Training': 'View equipment list',
  'Yoga Room': 'Start breathing exercise',
  'Photo Studio': 'Take a photo',
  'Video Studio': 'Start recording',
  'Recovery Suite': 'View cold plunge specs',
  'Spa & Wellness': 'Book a session',
  'Education Wing': 'Browse courses',
  'Front Desk': 'Check in',
}

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
        const threshold = Math.max(room.w, room.d) / 2 + 15

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

    const onInteract = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (lastRoom) {
          window.dispatchEvent(new CustomEvent('roomInteract', { detail: { room: lastRoom } }))
        }
      }
    }

    window.addEventListener('playerMove', handler as EventListener)
    window.addEventListener('keydown', onInteract)
    return () => {
      window.removeEventListener('playerMove', handler as EventListener)
      window.removeEventListener('keydown', onInteract)
    }
  }, [])

  if (!nearRoom) return null

  const colorHex = `#${nearRoom.color.toString(16).padStart(6, '0')}`
  const interaction = ROOM_INTERACTIONS[nearRoom.name]

  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center transition-all duration-500"
      style={{ opacity: opacity * 0.8 }}
    >
      {/* Room name */}
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

      {/* Interaction hint */}
      {interaction && (
        <div className="mt-2 text-[0.6rem] font-mono tracking-wider animate-pulse"
          style={{ color: `${colorHex}90` }}>
          Press <span className="inline-block px-1.5 py-0.5 rounded border text-[0.55rem]"
            style={{ borderColor: `${colorHex}40`, background: `${colorHex}10` }}>E</span> to {interaction.toLowerCase()}
        </div>
      )}
    </div>
  )
}

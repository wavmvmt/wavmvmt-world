'use client'

import { useState, useEffect, useRef } from 'react'
import { ROOMS } from '@/lib/roomConfig'
import { formatCurrency } from '@/lib/fundraisingConfig'
import { trackEvent } from '@/lib/analytics'

const panelStyle = {
  background: 'rgba(26,21,32,0.88)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.15)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

const ROOM_INTERACTION_RESULTS: Record<string, string> = {
  'Parkour Gym': '🏃 Obstacle courses: Wall runs, vault boxes, foam pit, bouldering wall',
  'Sound Bath': '🔔 The crystal bowl hums softly... frequencies wash over you',
  'Music Studio': '🎵 Beat pads light up — tap to create your rhythm',
  'Cafe & Lounge': '☕ Today\'s special: Matcha Latte + Protein Bowl — $14',
  'Amphitheatre': '🎭 The stage lights flicker on — 200 seats await your performance',
  'Weight Training': '🏋️ 8 power racks, Olympic platforms, dumbbells 5-150 lb',
  'Yoga Room': '🧘 Breathe in... 4 seconds. Hold... 4 seconds. Out... 4 seconds.',
  'Photo Studio': '📸 Flash! Your photo has been captured',
  'Video Studio': '🎬 Recording started — 3... 2... 1... Action!',
  'Recovery Suite': '❄️ Cold plunge: 39°F / 4°C — Are you brave enough?',
  'Spa & Wellness': '💆 Next available slot: massage, cryo, or salt room',
  'Education Wing': '📚 Courses: Business Basics, Creative Tech, Community Leadership',
  'Front Desk': '✅ Welcome to WAVMVMT — You\'ve been checked in',
}

export function RoomNotification() {
  const [currentRoom, setCurrentRoom] = useState<typeof ROOMS[0] | null>(null)
  const [visible, setVisible] = useState(false)
  const [interactionMsg, setInteractionMsg] = useState<string | null>(null)
  const lastRoom = useRef('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail

      for (const room of ROOMS) {
        const inRoom = Math.abs(x - room.x) < room.w / 2 && Math.abs(z - room.z) < room.d / 2
        if (inRoom && room.name !== lastRoom.current) {
          lastRoom.current = room.name
          setCurrentRoom(room)
          setVisible(true)
          setInteractionMsg(null)
          trackEvent('room_visit', { room: room.name })

          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => setVisible(false), 4000)
          break
        }
      }
    }

    const onInteract = (e: Event) => {
      const { room } = (e as CustomEvent).detail
      const msg = ROOM_INTERACTION_RESULTS[room]
      if (msg) {
        trackEvent('room_interact', { room })
        const roomDef = ROOMS.find(r => r.name === room)
        if (roomDef) setCurrentRoom(roomDef)
        setInteractionMsg(msg)
        setVisible(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          setVisible(false)
          setInteractionMsg(null)
        }, 5000)
      }
    }

    window.addEventListener('playerMove', onMove as EventListener)
    window.addEventListener('roomInteract', onInteract as EventListener)
    return () => {
      window.removeEventListener('playerMove', onMove as EventListener)
      window.removeEventListener('roomInteract', onInteract as EventListener)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!visible || !currentRoom) return null

  const hexColor = `#${currentRoom.color.toString(16).padStart(6, '0')}`

  return (
    <div
      className="fixed bottom-32 md:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-5 py-3 rounded-2xl max-w-sm transition-all duration-500"
      style={{
        ...panelStyle,
        borderColor: `${hexColor}30`,
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full" style={{ background: hexColor }} />
        <div>
          <div className="text-[0.7rem] font-bold" style={{ color: hexColor }}>
            {currentRoom.name}
          </div>
          {interactionMsg ? (
            <div className="text-[0.55rem] mt-0.5" style={{ color: 'rgba(255,220,180,0.6)' }}>
              {interactionMsg}
            </div>
          ) : (
            <>
              <div className="text-[0.5rem] font-mono" style={{ color: 'rgba(255,220,180,0.4)' }}>
                {currentRoom.sqft.toLocaleString()} sq ft · {formatCurrency(currentRoom.buildCost)} · {currentRoom.buildPct}% built
              </div>
              <div className="text-[0.48rem] italic mt-0.5" style={{ color: 'rgba(255,220,180,0.25)' }}>
                {currentRoom.vision}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

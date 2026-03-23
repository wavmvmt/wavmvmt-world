'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { ROOMS } from '@/lib/roomConfig'

const ROOM_ICONS: Record<string, string> = {
  'Parkour Gym': '🤸',
  'Sound Bath': '🔔',
  'Music Studio': '🎵',
  'Cafe & Lounge': '☕',
  'Front Desk': '🏗️',
  'Yoga Room': '🧘',
  'Weight Training': '💪',
  'Amphitheatre': '🎭',
  'Photo Studio': '📸',
  'Video Studio': '🎬',
  'Recovery Suite': '🧊',
  'Spa & Wellness': '💆',
}

/**
 * Floating emoji icons above each room — gentle bobbing animation.
 * Makes rooms visually identifiable from a distance.
 */
function RoomIcon({ room }: { room: typeof ROOMS[0] }) {
  const groupRef = useRef<HTMLDivElement>(null)
  const icon = ROOM_ICONS[room.name] || '🏗️'

  return (
    <group position={[room.x, room.h + 8, room.z]}>
      <Html center distanceFactor={40}>
        <div ref={groupRef} style={{
          fontSize: '24px',
          filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
          animation: `icon-bob ${3 + Math.random()}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {icon}
        </div>
      </Html>
    </group>
  )
}

export function RoomIcons() {
  return (
    <group>
      {ROOMS.map(room => (
        <RoomIcon key={room.name} room={room} />
      ))}
    </group>
  )
}

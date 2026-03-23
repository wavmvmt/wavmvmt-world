'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
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
  'Education Wing': '📚',
}

/**
 * Floating emoji icons above each room — gentle bobbing animation.
 * Makes rooms visually identifiable from a distance.
 */
function RoomIcon({ room }: { room: typeof ROOMS[0] }) {
  const groupRef = useRef<THREE.Group>(null)
  const icon = ROOM_ICONS[room.name] || '🏗️'
  const phaseOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = room.h + 8 + Math.sin(state.clock.elapsedTime * 0.8 + phaseOffset.current) * 1.5
    }
  })

  return (
    <group ref={groupRef} position={[room.x, room.h + 8, room.z]}>
      <Html center distanceFactor={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 40}>
        <div style={{
          fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '16px' : '24px',
          filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
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

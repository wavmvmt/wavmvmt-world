'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Interior lighting for each room — warm colored point lights
 * that make the room contents visible and inviting.
 * Intensity scales with build percentage.
 * Gentle breathing animation.
 */
export function RoomInteriorLights() {
  const lightsRef = useRef<(THREE.PointLight | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    lightsRef.current.forEach((light, i) => {
      if (!light) return
      const room = ROOMS[i]
      if (!room) return
      const base = 0.2 + (room.buildPct / 100) * 0.6
      const breath = 1 + Math.sin(t * 0.3 + i * 0.7) * 0.08
      light.intensity = base * breath
    })
  })

  return (
    <group>
      {ROOMS.map((room, i) => (
        <pointLight
          key={room.name}
          ref={el => { lightsRef.current[i] = el }}
          position={[room.x, room.h * 0.5, room.z]}
          color={room.color}
          intensity={0.2}
          distance={Math.max(room.w, room.d) * 0.8}
          decay={2}
        />
      ))}
    </group>
  )
}

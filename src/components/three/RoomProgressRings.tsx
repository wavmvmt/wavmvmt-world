'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Floating progress ring at the base of each room showing build %.
 * Rotates slowly, glows with room color. Visual indicator of completion.
 */
export function RoomProgressRings() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      child.rotation.y = t * 0.1 + i * 0.5
    })
  })

  return (
    <group ref={groupRef}>
      {ROOMS.map((room, i) => {
        if (room.buildPct <= 0) return null
        const radius = Math.max(room.w, room.d) / 2 + 2
        const arcLength = (room.buildPct / 100) * Math.PI * 2

        return (
          <group key={room.name} position={[room.x, 0.15, room.z]}>
            {/* Progress arc */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.15, 4, 32, arcLength]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.25}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Background track (full circle, very dim) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.08, 4, 32]} />
              <meshBasicMaterial
                color={room.color}
                transparent
                opacity={0.04}
                depthWrite={false}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

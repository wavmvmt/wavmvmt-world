'use client'
import { detectPerformanceLevel } from '@/lib/performanceMode'
const _doorLevel = typeof window !== 'undefined' ? detectPerformanceLevel() : 'medium'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { ROOMS, COLORS } from '@/lib/roomConfig'

/**
 * Animated doors on rooms with buildPct >= 60.
 * Doors swing open when player approaches, close when they leave.
 */
function AnimatedDoor({ room }: { room: typeof ROOMS[0] }) {
  const doorRef = useRef<THREE.Group>(null)
  const openRef = useRef(0)
  const playerNear = useRef(false)
  const [inRange, setInRange] = useState(false)

  useEffect(() => {
    // Show door when player within 80 units — unmount geometry when far
    const DOOR_RENDER_DIST = 80
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const doorX = room.x
      const doorZ = room.z + room.d / 2 + 2
      const dist = Math.sqrt((x - doorX) ** 2 + (z - doorZ) ** 2)
      playerNear.current = dist < 8
      setInRange(dist < DOOR_RENDER_DIST)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [room])

  const _fsDoor = useRef(0)
  useFrame(() => {
    _fsDoor.current = (_fsDoor.current + 1) % 2
    if (_fsDoor.current !== 0) return
    if (!doorRef.current) return
    const target = playerNear.current ? 1 : 0
    openRef.current += (target - openRef.current) * 0.05
    // Swing the door open on Y axis
    doorRef.current.rotation.y = openRef.current * -Math.PI / 2.5
  })

  const hexColor = `#${room.color.toString(16).padStart(6, '0')}`

  if (!inRange) return null
  return (
    <group position={[room.x, 0, room.z + room.d / 2 + 0.1]}>
      {/* Door frame */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[3, 5, 0.3]} />
        <meshLambertMaterial color={COLORS.woodDk} />
      </mesh>

      {/* Door panel — pivots from left edge */}
      <group ref={doorRef} position={[-1.2, 0, 0]}>
        <mesh position={[1.2, 2.5, 0.2]}>
          <boxGeometry args={[2.4, 4.5, 0.12]} />
          <meshStandardMaterial
            color={room.color}
            transparent
            opacity={0.7 + (room.buildPct / 100) * 0.3}
          />
        </mesh>
        {/* Handle */}
        <mesh position={[2.1, 2.3, 0.35]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshLambertMaterial color={COLORS.copper} />
        </mesh>
      </group>

      {/* Room name above door */}
      <Html position={[0, 5.5, 0]} center distanceFactor={18}>
        <div style={{
          color: hexColor,
          fontSize: '11px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          opacity: 0.7,
          pointerEvents: 'none',
        }}>
          {room.name}
        </div>
      </Html>
    </group>
  )
}

export function AnimatedDoors() {
  const doorsRooms = ROOMS.filter(r => r.buildPct >= 60)

  return (
    <group>
      {doorsRooms.map(room => (
        <AnimatedDoor key={room.name} room={room} />
      ))}
    </group>
  )
}

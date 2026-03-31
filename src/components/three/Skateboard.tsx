'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const RIDE_SPEED = 35 // Much faster than walking
const BOARD_POSITIONS: [number, number, number][] = [
  [15, 0, 30],
  [-40, 0, -20],
  [80, 0, 0],
  [-100, 0, 60],
]

let _fs_Skateboa = 0
function SkateboardEntity({ position, index }: {
  position: [number, number, number]; index: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [nearby, setNearby] = useState(false)
  const [riding, setRiding] = useState(false)
  const playerPos = useRef({ x: 0, z: 0 })
  const ridePhase = useRef(0)

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', handler as EventListener)
    return () => window.removeEventListener('playerMove', handler as EventListener)
  }, [])

  // Listen for E key to mount/dismount
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e') {
        if (riding) {
          setRiding(false)
          // Dispatch speed change back to normal
          window.dispatchEvent(new CustomEvent('rideChange', { detail: { riding: false, speed: 18 } }))
        } else if (nearby) {
          setRiding(true)
          window.dispatchEvent(new CustomEvent('rideChange', { detail: { riding: true, speed: RIDE_SPEED } }))
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [nearby, riding])

  useFrame((state) => {
    if ((_fs_Skateboa = (_fs_Skateboa + 1) % 3) !== 0) return
    if (!groupRef.current) return
    const px = playerPos.current.x
    const pz = playerPos.current.z
    const bx = groupRef.current.position.x
    const bz = groupRef.current.position.z

    const dist = Math.sqrt((px - bx) ** 2 + (pz - bz) ** 2)
    setNearby(dist < 5 && !riding)

    if (riding) {
      // Board follows player
      groupRef.current.position.x = px
      groupRef.current.position.z = pz
      ridePhase.current += 0.15

      // Wobble animation
      groupRef.current.rotation.z = Math.sin(ridePhase.current) * 0.03
      groupRef.current.rotation.x = Math.sin(ridePhase.current * 1.3) * 0.02
    } else {
      // Idle wobble
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.01
    }
  })

  const boardColor = [COLORS.rose, COLORS.lavender, COLORS.sage, COLORS.sky][index % 4]

  return (
    <group ref={groupRef} position={position}>
      {/* Deck */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.9]} />
        <meshStandardMaterial color={boardColor} roughness={0.7} />
      </mesh>
      {/* Nose/tail curve */}
      <mesh position={[0, 0.1, 0.4]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.28, 0.03, 0.15]} />
        <meshStandardMaterial color={boardColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, -0.4]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.28, 0.03, 0.15]} />
        <meshStandardMaterial color={boardColor} roughness={0.7} />
      </mesh>
      {/* Trucks */}
      {[-0.25, 0.25].map((z, i) => (
        <mesh key={i} position={[0, 0.04, z]}>
          <boxGeometry args={[0.25, 0.03, 0.08]} />
          <meshStandardMaterial color={COLORS.steel} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Wheels */}
      {[-0.12, 0.12].flatMap(x =>
        [-0.25, 0.25].map((z, i) => (
          <mesh key={`${x}-${i}`} position={[x, 0.02, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
            <meshStandardMaterial color={0xf0f0f0} roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Proximity prompt */}
      {nearby && (
        <Html position={[0, 0.8, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(26,21,32,0.85)',
            border: '1px solid rgba(240,198,116,0.3)',
            borderRadius: '8px',
            padding: '4px 10px',
            color: '#f0c674',
            fontSize: '10px',
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            Press E to ride
          </div>
        </Html>
      )}

      {/* Riding indicator */}
      {riding && (
        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
          <div style={{
            color: 'rgba(240,198,116,0.5)',
            fontSize: '8px',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.15em',
            pointerEvents: 'none',
          }}>
            E to dismount
          </div>
        </Html>
      )}
    </group>
  )
}

export function Skateboards() {
  // Listen for ride changes and update player speed
  useEffect(() => {
    const handler = (e: Event) => {
      const { speed } = (e as CustomEvent).detail
      // Dispatch to Player via a global state
      window.dispatchEvent(new CustomEvent('speedOverride', { detail: { speed } }))
    }
    window.addEventListener('rideChange', handler as EventListener)
    return () => window.removeEventListener('rideChange', handler as EventListener)
  }, [])

  return (
    <group>
      {BOARD_POSITIONS.map((pos, i) => (
        <SkateboardEntity key={i} position={pos} index={i} />
      ))}
    </group>
  )
}

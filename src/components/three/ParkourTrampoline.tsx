'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

const TRAMPOLINE_POSITIONS: [number, number, number][] = [
  [-120, 0.15, -90],  // center of parkour gym
  [-90, 0.15, -70],
  [-110, 0.15, -60],
  [-80, 0.15, -100],
]

function Trampoline({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const bouncing = useRef(false)
  const bouncePhase = useRef(0)

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const dist = Math.sqrt((x - position[0]) ** 2 + (z - position[2]) ** 2)
      if (dist < 3 && !bouncing.current) {
        bouncing.current = true
        bouncePhase.current = 0
        // Super jump!
        window.dispatchEvent(new CustomEvent('superJump', { detail: { force: 18 } }))
        window.dispatchEvent(new CustomEvent('celebrate'))
      }
      if (dist > 5) bouncing.current = false
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [position])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    if (bouncing.current) {
      bouncePhase.current += delta * 8
      const squash = 1 - Math.sin(bouncePhase.current) * 0.3 * Math.exp(-bouncePhase.current * 0.5)
      meshRef.current.scale.y = squash
      meshRef.current.scale.x = 1 + (1 - squash) * 0.5
      meshRef.current.scale.z = 1 + (1 - squash) * 0.5
    } else {
      meshRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <group position={position}>
      {/* Trampoline surface */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[2.5, 2.5, 0.3, 8]} />
        <meshStandardMaterial color={COLORS.lavender} transparent opacity={0.6} roughness={0.5} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.1, 6, 16]} />
        <meshStandardMaterial color={COLORS.steel} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Legs */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.3, -0.3, Math.sin(angle) * 2.3]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 4]} />
            <meshStandardMaterial color={COLORS.steel} roughness={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export function ParkourTrampolines() {
  // Listen for super jump events and boost player
  useEffect(() => {
    const handler = (e: Event) => {
      const { force } = (e as CustomEvent).detail
      // Dispatch to Player
      window.dispatchEvent(new CustomEvent('boostJump', { detail: { force } }))
    }
    window.addEventListener('superJump', handler as EventListener)
    return () => window.removeEventListener('superJump', handler as EventListener)
  }, [])

  return (
    <group>
      {TRAMPOLINE_POSITIONS.map((pos, i) => (
        <Trampoline key={i} position={pos} />
      ))}
    </group>
  )
}

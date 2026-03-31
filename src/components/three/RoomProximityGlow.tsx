'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ROOMS } from '@/lib/roomConfig'

/**
 * Adds a subtle pulsing glow to rooms when the player is nearby.
 * A ground-level circle of light appears under the player's feet
 * colored by the nearest room's theme color.
 */
export function RoomProximityGlow() {
  const glowRef = useRef<THREE.PointLight>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const playerPos = useRef({ x: 0, z: 0 })

  useEffect(() => {
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      playerPos.current = { x, z }
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [])

  const _fsGlw = useRef(0)
  useFrame((state) => {
    _fsGlw.current = (_fsGlw.current + 1) % 10  // ~6fps — glow changes slowly
    if (_fsGlw.current !== 0) return
    if (!glowRef.current || !ringRef.current) return
    const px = playerPos.current.x
    const pz = playerPos.current.z
    const t = state.clock.elapsedTime

    // Find nearest room
    let nearestDist = Infinity
    let nearestRoom = ROOMS[0]
    for (const room of ROOMS) {
      const dist = Math.sqrt((px - room.x) ** 2 + (pz - room.z) ** 2)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestRoom = room
      }
    }

    // Glow intensity based on proximity
    const maxDist = 40
    const proximity = Math.max(0, 1 - nearestDist / maxDist)
    const pulse = 0.8 + Math.sin(t * 2) * 0.2

    glowRef.current.position.set(px, 0.5, pz)
    glowRef.current.color.set(nearestRoom.color)
    glowRef.current.intensity = proximity * 0.8 * pulse

    // Ring on ground
    ringRef.current.position.set(px, 0.05, pz)
    const mat = ringRef.current.material as THREE.MeshBasicMaterial
    mat.color.set(nearestRoom.color)
    mat.opacity = proximity * 0.08 * pulse
  })

  return (
    <>
      <pointLight ref={glowRef} distance={15} decay={2} intensity={0} />
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 3, 24]} />
        <meshBasicMaterial color={0xffffff} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  )
}
